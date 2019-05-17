class Hoverable {
    constructor(divClass) {
        this.divClass = divClass;
        this.hoverables = null;
    }

    createHoverable() {
        let divImages = document.getElementsByClassName(this.divClass);

        let root = null;
        let divOverlay = null;
        let buttonHover = null;
        this.hoverables = [];

        let downloadImage = chrome.runtime.getURL("icons/download_multiple.png");


        for (let i = 0; i < divImages.length; ++i) {
            root = divImages[i];

            divOverlay = document.createElement("div");
            divOverlay.classList.add("middle");
            root.appendChild(divOverlay);

            buttonHover = document.createElement("a");
            buttonHover.id = root.firstElementChild.href;
            buttonHover.style.backgroundImage = "url(" + downloadImage + ")";
            buttonHover.style.backgroundSize = "42%";
            buttonHover.style.backgroundRepeat = "no-repeat";
            buttonHover.style.backgroundPosition = "center";
            buttonHover.style.display = "inline-block";
            buttonHover.style.cursor = "pointer";

            buttonHover.addEventListener("click", function (event) {
                hoverableButton.issueDownload(event.target.id);
            });

            buttonHover.classList.add("button");
            divOverlay.appendChild(buttonHover);

            this.hoverables.push(divOverlay);
        }
    }

    issueDownload(url) {
        url = url + "?__a=1"
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {

                let json = JSON.parse(xhttp.responseText);
                if ((json["graphql"]["shortcode_media"]["__typename"]).indexOf("Video") !== -1) {
                    chrome.runtime.sendMessage([(json["graphql"]["shortcode_media"]["video_url"]), "HuiBuh"]);
                } else if ((json["graphql"]["shortcode_media"]["__typename"]).indexOf("Image") !== -1) {
                    chrome.runtime.sendMessage([(json["graphql"]["shortcode_media"]["display_resources"]["2"]["src"]), "HuiBuh"]);
                }
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }


    removeHoverable() {
        try {
            if (this.hoverables.length > 0) {
                for (let i = 0; i < this.hoverables.length - 1; ++i) {
                    this.hoverables[i].remove();
                }
            }
        } catch (e) {
            console.log("Could not remove the button")
        }
    }
}