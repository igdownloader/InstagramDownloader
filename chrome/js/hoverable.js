const divHoverPicture = "v1Nh3 kIKUG _bz0w";
const divHoverVideo = "_bz0w";

class Hoverable {
    /***
     * Creates a hover download button on the main page
     */
    constructor() {
        this.hoverables = null;
    }

    /**
     * Creates all hover button
     */
    createHoverable() {

        let divImages = document.getElementsByClassName(divHoverPicture);
        if (!divImages.length > 0) {
            divImages = document.getElementsByClassName(divHoverVideo);
        }


        let root = null;
        let divOverlay = null;
        let buttonHover = null;
        this.hoverables = [];

        let downloadImage = chrome.runtime.getURL("icons/download_white.png");

        for (let i = 0; i < divImages.length; ++i) {
            root = divImages[i];
            root.style.position = "relative";

            divOverlay = document.createElement("div");
            divOverlay.classList.add("middle");
            root.appendChild(divOverlay);

            buttonHover = document.createElement("a");
            let id = root.firstElementChild.href;

            if (id === undefined) {
                id = root.href;
                divOverlay.classList.remove("middle");
                divOverlay.classList.add("tv-middle");

                divOverlay.addEventListener("click", async function (event) {
                    await sleep(20);
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    //redirect back
                    window.history.go(-1);
                    //Check on what element was clicked
                    let temp = event.target.firstChild;
                    if (temp === null) {
                        let id = event.target.id;
                    } else {
                        let id = event.event.target.firstChild;
                    }
                    hoverButton.issueDownload(id);
                });
            } else {
                buttonHover.addEventListener("click", async function (event) {
                    hoverButton.issueDownload(event.target.id);
                });
            }

            //parent position relative


            buttonHover.id = id;
            buttonHover.style.backgroundImage = "url(" + downloadImage + ")";
            buttonHover.style.backgroundSize = "42%";
            buttonHover.style.backgroundRepeat = "no-repeat";
            buttonHover.style.backgroundPosition = "center";
            buttonHover.style.display = "inline-block";
            buttonHover.style.cursor = "pointer";


            buttonHover.classList.add("button");
            divOverlay.appendChild(buttonHover);

            this.hoverables.push(divOverlay);
        }
    }

    /***
     * After a click event on the button a xhttp request is executed and a message with the download url send to the
     * download.js background script
     * @param url The URL of the picture and not of the download
     */
    issueDownload(url) {
        url = url + "?__a=1";
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {

                let json = JSON.parse(xhttp.responseText);
                if ((json["graphql"]["shortcode_media"]["__typename"]).indexOf("Video") !== -1) {
                    let dlUrl = json["graphql"]["shortcode_media"]["video_url"];
                    chrome.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh", "type": "video"});
                } else if ((json["graphql"]["shortcode_media"]["__typename"]).indexOf("Image") !== -1) {
                    let dlUrl = json["graphql"]["shortcode_media"]["display_resources"]["2"]["src"];
                    chrome.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh", "type": "image"});
                } else if ((json["graphql"]["shortcode_media"]["__typename"]).indexOf("GraphSidecar") !== -1) {
                    let dlUrl = json["graphql"]["shortcode_media"]["display_resources"]["2"]["src"];
                    chrome.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh", "type": "image"});
                }
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }


    /***
     * removes all the hover button
     */
    removeHover() {
        try {
            if (this.hoverables.length > 0) {
                for (let i = 0; i < this.hoverables.length; ++i) {
                    this.hoverables[i].remove();
                }
            }
        } catch (e) {
            console.log("Could not remove the button")
        }
    }
}
