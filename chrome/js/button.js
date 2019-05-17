class Button {
    /***
     * Button class. Creates and handles the buttons that appear next to the bookmark button
     * @param buttonClass Class the button should get
     * @param spanClass Class the span around the button should get
     */
    constructor(buttonClass, spanClass) {
        this.buttonClass = buttonClass;
        this.spanClass = spanClass;
        this.outerSpan = "";
    }

    /***
     * Creates the button at the right position
     */
    createButton() {
        try {
            let parentElement = document.getElementsByClassName(this.spanClass)[0];

            this.outerSpan = document.createElement("span");
            this.outerSpan.style.paddingTop = ".12rem";
            parentElement.appendChild(this.outerSpan);

            let outerButton = document.createElement("button");
            outerButton.className = "dCJp8 afkep _0mzm-";
            this.outerSpan.appendChild(outerButton);

            let buttonEmbedded = document.createElement("span");

            let downloadImage = chrome.runtime.getURL("icons/download.png");
            buttonEmbedded.style.backgroundImage = "url(" + downloadImage + ")";

            buttonEmbedded.id = window.location.href;
            buttonEmbedded.className = this.buttonClass;
            buttonEmbedded.style.backgroundSize = "75%";
            buttonEmbedded.style.backgroundRepeat = "no-repeat";
            buttonEmbedded.style.backgroundPosition = "center";
            buttonEmbedded.style.display = "inline-block";
            buttonEmbedded.style.opacity = "0.5";

            buttonEmbedded.addEventListener("click", function (event) {
                downloadButton.issueDownload(event.target.id);
            });


            outerButton.appendChild(buttonEmbedded);
        } catch (e) {
            console.log("Could not create a button")
        }
    }

    /***
     * Deletes the button
     */
    deleteButton() {
        try {
            this.outerSpan.remove();
        } catch {
            console.log("Could not remove the button");
        }
    }

    /**
     * After a click event on the button a xhttp request is executed and a message with the download url send to the
     * download.js background script
     * @param url Instagram URL of the image (Not the download URL
     */
    issueDownload(url) {
        url = url + "?__a=1";
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {

                // get the json of the picture
                let json = JSON.parse(xhttp.responseText);
                // if the content type is a video, or a image, or a image slider
                if ((json["graphql"]["shortcode_media"]["__typename"]).indexOf("Video") !== -1) {
                    let dlUrl = json["graphql"]["shortcode_media"]["video_url"];
                    chrome.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh"});
                } else if ((json["graphql"]["shortcode_media"]["__typename"]).indexOf("Image") !== -1) {
                    let dlUrl = json["graphql"]["shortcode_media"]["display_resources"]["2"]["src"];
                    chrome.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh"});
                } else if ((json["graphql"]["shortcode_media"]["__typename"]).indexOf("GraphSidecar") !== -1) {
                    // Check if the click event was issued from the "main page" and gets the pictures in the slider
                    if (document.getElementsByClassName("_2dDPU vCf6V").length === 1) {
                        var pictureSlider = document.getElementsByClassName("_2dDPU vCf6V")[0].getElementsByClassName("FFVAD");
                    } else {
                        var pictureSlider = document.getElementsByClassName("FFVAD");
                    }
                    // checks where the slider is positioned. (The center element is always the desired image)
                    if (pictureSlider.length === 3) {
                        let dlUrl = pictureSlider[1].src;
                        chrome.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh"});
                    } else if (pictureSlider.length === 2) {
                        // check if it is the first or last image that should be downloaded
                        if (pictureSlider[0]["src"].includes(json["graphql"]["shortcode_media"]["edge_sidecar_to_children"]["edges"][0]["node"]["display_url"])) {
                            let dlUrl = pictureSlider[0].src;
                            chrome.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh"});
                            chrome.runtime.sendMessage([pictureSlider[0].src, "HuiBuh"])
                        } else {
                            let dlUrl = pictureSlider[1].src;
                            chrome.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh"});
                        }
                    }


                }
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }
}
