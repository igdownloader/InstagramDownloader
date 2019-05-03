class Button {
    constructor(buttonClass, spanClass, url) {
        this.url = url;
        this.buttonClass = buttonClass;
        this.spanClass = spanClass;
        this.outerSpan = "";
        this.downloadLink = ""
    }

    createButton() {
        try {
            let parentElement = document.getElementsByClassName(this.spanClass)[0];

            this.outerSpan = document.createElement("span");
            parentElement.appendChild(this.outerSpan);

            let downloadButton = document.createElement("a");

            let downloadImage = browser.runtime.getURL("icons/download.png");
            downloadButton.style.backgroundImage = "url(" + downloadImage + ")";

            downloadButton.href = this.downloadLink;
            downloadButton.className = this.buttonClass;
            downloadButton.style.backgroundSize = "75%";
            downloadButton.style.backgroundRepeat = "no-repeat";
            downloadButton.style.backgroundPosition = "center";
            downloadButton.style.display = "inline-block";
            downloadButton.style.marginBottom = "-1.75rem";
            downloadButton.style.opacity = "0.5";
            downloadButton.target = "_blank";

            this.outerSpan.appendChild(downloadButton);
        } catch {
            console.log("Could not create a button")
        }
    }

    deleteButton() {
        try {
            this.outerSpan.remove();
        } catch {
            console.log("Could not remove the button");
        }
    }


    createLink() {
        this.url = this.url + "?__a=1";
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let json = JSON.parse(xhttp.responseText);

                if ((json["graphql"]["shortcode_media"]["__typename"]).indexOf("Video") !== -1) {
                    downloadButton.setLink(json["graphql"]["shortcode_media"]["video_url"])
                } else if ((json["graphql"]["shortcode_media"]["__typename"]).indexOf("Image") !== -1) {
                    downloadButton.setLink(json["graphql"]["shortcode_media"]["display_resources"]["2"]["src"])
                }
            }
        };

        xhttp.open("GET", this.url, true);
        xhttp.send();
    }


    setLink(downloadLink) {
        this.downloadLink = downloadLink;
    }
}