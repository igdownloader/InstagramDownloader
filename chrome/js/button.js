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

                //_-1_m6 für alle Lines
                //FFVAD für alle Bilder
                //tWeCl für alle videos

                // alle _-1_m6 holen
                // für alle _-1_m6
                //systematisch auf FFVAD oder tWeCl überprüfen und der reihe nach in pictureSlider stecken


                // get the json of the picture
                let json = JSON.parse(xhttp.responseText);
                // if the content type is a video, or a image, or a image slider
                if ((json["graphql"]["shortcode_media"]["__typename"]).indexOf("Video") !== -1) {
                    var dlUrl = json["graphql"]["shortcode_media"]["video_url"];
                    chrome.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh"});
                } else if ((json["graphql"]["shortcode_media"]["__typename"]).indexOf("Image") !== -1) {
                    var dlUrl = json["graphql"]["shortcode_media"]["display_resources"]["2"]["src"];
                    chrome.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh"});
                } else if ((json["graphql"]["shortcode_media"]["__typename"]).indexOf("GraphSidecar") !== -1) {

                    var pictureSlider = [];
                    let imageSlide = null;
                    let videoSlide = null;
                    //all the 
                    let allContent = document.getElementsByClassName("_-1_m6");
                    for (var i = 0; i < allContent.length; ++i) {
                        imageSlide = allContent[i].getElementsByClassName("FFVAD");
                        videoSlide = allContent[i].getElementsByClassName("tWeCl");
                        if (imageSlide.length > 0) {
                            pictureSlider.push(imageSlide);
                            imageSlide = null;
                        } else if (videoSlide.length > 0) {
                            pictureSlider.push(videoSlide);
                            imageSlide = 0;
                        }
                    }

                    // checks where the slider is positioned. (The center element is always the desired image)
                    if (pictureSlider.length === 3) {
                        var dlUrl = pictureSlider[1][0].src;
                        chrome.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh"});
                    } else if (pictureSlider.length === 2) {

                        // ToDo


                        // check if it is the first or last image that should be downloaded
                        if (pictureSlider[0]["src"].includes(json["graphql"]["shortcode_media"]["edge_sidecar_to_children"]["edges"][0]["node"]["display_url"])) {
                            if (json["graphql"]["shortcode_media"]["edge_sidecar_to_children"]["edges"][0]["node"]["__typename"].includes("Video")) {
                                var dlUrl = json["graphql"]["shortcode_media"]["edge_sidecar_to_children"]["edges"][0]["node"]["video_url"];
                            } else {
                                var dlUrl = pictureSlider["0"].src;
                            }
                            chrome.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh"});
                        } else {
                            if (json["graphql"]["shortcode_media"]["edge_sidecar_to_children"]["edges"][1]["node"]["__typename"].includes("Video")) {
                                var dlUrl = json["graphql"]["shortcode_media"]["edge_sidecar_to_children"]["edges"][1]["node"]["video_url"];
                            } else {
                                var dlUrl = pictureSlider[1].src;
                            }
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
