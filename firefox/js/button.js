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

            let downloadImage = browser.runtime.getURL("icons/download.png");
            buttonEmbedded.style.backgroundImage = "url(" + downloadImage + ")";

            buttonEmbedded.id = window.location.href.split('?')[0];
            buttonEmbedded.className = this.buttonClass;
            buttonEmbedded.style.backgroundSize = "75%";
            buttonEmbedded.style.backgroundRepeat = "no-repeat";
            buttonEmbedded.style.backgroundPosition = "center";
            buttonEmbedded.style.display = "inline-block";
            buttonEmbedded.style.opacity = "0.5";

            buttonEmbedded.addEventListener("click", function (event) {
                downloadButton.issueDownload(event.target["id"]);
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
                let dlUrl = null;
                let json = JSON.parse(xhttp.responseText);
                // if the content type is a video, or a image, or a image slider
                if ((json["graphql"]["shortcode_media"]["__typename"]).indexOf("Video") !== -1) {
                    dlUrl = json["graphql"]["shortcode_media"]["video_url"];
                    browser.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh", "type": "video"});
                } else if ((json["graphql"]["shortcode_media"]["__typename"]).indexOf("Image") !== -1) {
                    dlUrl = json["graphql"]["shortcode_media"]["display_resources"]["2"]["src"];
                    browser.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh","type": "video"});
                } else if ((json["graphql"]["shortcode_media"]["__typename"]).indexOf("GraphSidecar") !== -1) {

                    var pictureSlider = [];
                    let imageSlide = null;
                    let videoSlide = null;
                    //all the pictures/videos in the slide
                    let allContent = document.getElementsByClassName("_-1_m6");

                    //for each line check if there is a picture or a video in it and get the Class
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
                        dlUrl = pictureSlider[1][0].src;
                        if (pictureSlider[1][0].tagName.includes("IMG")) {
                            browser.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh", "type": "image"});
                        } else if (pictureSlider[1][0].tagName.includes("VIDEO")) {
                            browser.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh", "type": "video"});
                        }

                    } else if (pictureSlider.length === 2) {

                        //if the first image to in the <li> is an image or a video
                        if (pictureSlider[0][0].tagName.includes("IMG")) {
                            if (pictureSlider[0][0].src.includes(json["graphql"]["shortcode_media"]["edge_sidecar_to_children"]["edges"][1]["node"]["display_url"])) {
                                dlUrl = pictureSlider[0][0].src;
                                browser.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh", "type": "image"});
                                return

                            }
                        } else if (pictureSlider[0][0].tagName.includes("VIDEO")) {
                            if (pictureSlider[0][0].src.includes(json["graphql"]["shortcode_media"]["edge_sidecar_to_children"]["edges"][0]["node"]["video_url"])) {
                                dlUrl = pictureSlider[0][0].src;
                                browser.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh", "type": "video"});
                                return

                            }
                        }

                        dlUrl = pictureSlider[1][0].src;
                        if (pictureSlider[1][0].tagName.includes("IMG")) {
                            browser.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh", "type": "image"});
                        } else if (pictureSlider[1][0].tagName.includes("VIDEO")) {
                            browser.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh", "type": "video"});
                        }

                    }
                }
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }
}
