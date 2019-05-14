class Hoverable {
    constructor(divClass) {
        this.divClass = divClass;
        this.hoverables = null;
        this.link;
    }

    createHoverable() {
        let divImages = document.getElementsByClassName(this.divClass);

        let root = null;
        let divOverlay = null;
        let buttonHover = null;
        this.hoverables = [];

        for (let i = 0; i < divImages.length - 1; ++i) {
            root = divImages[i];

            divOverlay = document.createElement("div");
            divOverlay.classList.add("middle");
            divOverlay.setAttribute("link", root.firstElementChild.href);
            root.appendChild(divOverlay);

            buttonHover = document.createElement("a");
            buttonHover.classList.add("button");
            divOverlay.appendChild(buttonHover);

            this.hoverables.push(divOverlay);
        }
    }

    createLink() {
        let url;
        for (let i = 0; i < this.hoverables.length - 1; ++i) {

            url = this.hoverables[i].getAttribute("link");
            url = url + "?__a=1";

            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {

                    let json = JSON.parse(xhttp.responseText);

                    if ((json["graphql"]["shortcode_media"]["__typename"]).indexOf("Video") !== -1) {
                        hoverableButton.hoverables[i].firstElementChild.href = (json["graphql"]["shortcode_media"]["video_url"])
                    } else if ((json["graphql"]["shortcode_media"]["__typename"]).indexOf("Image") !== -1) {
                        hoverableButton.hoverables[i].firstElementChild.href = (json["graphql"]["shortcode_media"]["display_resources"]["2"]["src"])
                    }
                }
            };
            xhttp.open("GET", url, true);
            xhttp.send();
        }
    }

    removeHoverable() {
        try {
            if (this.hoverables.length > 0) {
                for (let i = 0; i < this.hoverables.length - 1; ++i) {
                    this.hoverables[i].remove();
                }
            }
        } catch (e) {
            console.log(e)
        }
    }
}