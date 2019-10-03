const outerButtonClassName = "dCJp8 afkep _0mzm-";
const buttonClass = "dCJp8 afkep _0mzm -";
const spanClass = "ltpMr Slqrh";

const articleClassLarge = "M9sTE  L_LMM  JyscU  ePUX4";
const articleClassSmall = "M9sTE h0YNM  SgTZ1   ";

const sliderContentClass = "_-1_m6";
const imageContentClass = "FFVAD";
const videoContentClass = "tWeCl";

class Button {
    /***
     * Button class. Creates and handles the buttons that appear next to the bookmark button
     * @param buttonClass Class the button should get
     * @param spanClass Class the span around the button should get
     */
    constructor(buttonClass, spanClass) {
        this.outerSpan = "";
    }

    /***
     * Creates the button at the right position
     */
    createButton() {
        try {
            let parentElement = document.getElementsByClassName(spanClass)[0];

            this.outerSpan = document.createElement("span");
            parentElement.appendChild(this.outerSpan);

            let outerButton = document.createElement("button");
            outerButton.className = outerButtonClassName;
            this.outerSpan.appendChild(outerButton);

            let buttonEmbedded = document.createElement("span");

            let downloadImage = browser.runtime.getURL("icons/download.png");
            buttonEmbedded.style.backgroundImage = "url(" + downloadImage + ")";

            buttonEmbedded.id = window.location.href.split('?')[0];
            buttonEmbedded.className = buttonClass;
            buttonEmbedded.style.backgroundSize = "59%";
            buttonEmbedded.style.backgroundRepeat = "no-repeat";
            buttonEmbedded.style.backgroundPosition = "center";
            buttonEmbedded.style.display = "inline-block";
            buttonEmbedded.style.opacity = "0.7";

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
     * Download url is send to download.js
     * download.js background script
     * @param url Instagram URL of the image (Not the download URL
     */
    issueDownload(url) {
        let temp1 = document.getElementsByClassName(articleClassLarge);
        let temp2 = document.getElementsByClassName(articleClassSmall);
        let parent = null;
        if (temp1.length > 0) {
            parent = temp1[0];
        } else if (temp2.length > 0) {
            parent = temp2[0];
        }

        //ToDo

        let videoDownload = parent.getElementsByClassName(videoContentClass);
        let imageDownload = parent.getElementsByClassName(imageContentClass);
        let sliderDownload = parent.getElementsByClassName(sliderContentClass);

        let dlUrl = null;
        if (typeof (videoDownload) !== "undefined" && videoDownload.length > 0 && sliderDownload.length === 0) {
            dlUrl = videoDownload[0].src;
            browser.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh", "type": "video", "accountName": accountName});
        } else if (typeof (imageDownload) !== "undefined" && imageDownload.length > 0 && sliderDownload.length === 0) {
            dlUrl = imageDownload[0].src;
            browser.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh", "type": "image", "accountName": accountName});
        } else if (typeof (sliderDownload) !== "undefined" && sliderDownload.length > 0) {

            var pictureSlider = [];
            let imageSlide = null;
            let videoSlide = null;
            //all the pictures/videos in the slide
            let allContent = parent.getElementsByClassName(sliderContentClass);

            //for each line check if there is a picture or a video in it and get the Class
            for (var i = 0; i < allContent.length; ++i) {
                imageSlide = allContent[i].getElementsByClassName(imageContentClass);
                videoSlide = allContent[i].getElementsByClassName(videoContentClass);
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
                    browser.runtime.sendMessage({
                        "url": dlUrl,
                        "user": "HuiBuh",
                        "type": "image",
                        "accountName": accountName
                    });
                } else if (pictureSlider[1][0].tagName.includes("VIDEO")) {
                    browser.runtime.sendMessage({
                        "url": dlUrl,
                        "user": "HuiBuh",
                        "type": "video",
                        "accountName": accountName
                    });
                }

            } else if (pictureSlider.length === 2) {

                let right = [];
                right = document.getElementsByClassName("    coreSpriteRightChevron");

                if (right.length > 0) {
                    if (pictureSlider[0][0].tagName.includes("IMG")) {
                        dlUrl = pictureSlider[0][0].src;
                        browser.runtime.sendMessage({
                            "url": dlUrl,
                            "user": "HuiBuh",
                            "type": "image",
                            "accountName": accountName
                        });
                        return
                    } else if (pictureSlider[0][0].tagName.includes("VIDEO")) {
                        dlUrl = pictureSlider[0][0].src;
                        browser.runtime.sendMessage({
                            "url": dlUrl,
                            "user": "HuiBuh",
                            "type": "video",
                            "accountName": accountName
                        });
                        return
                    }
                }

                dlUrl = pictureSlider[1][0].src;
                if (pictureSlider[1][0].tagName.includes("IMG")) {
                    browser.runtime.sendMessage({
                        "url": dlUrl,
                        "user": "HuiBuh",
                        "type": "image",
                        "accountName": accountName
                    });
                } else if (pictureSlider[1][0].tagName.includes("VIDEO")) {
                    browser.runtime.sendMessage({
                        "url": dlUrl,
                        "user": "HuiBuh",
                        "type": "video",
                        "accountName": accountName
                    });
                }

            }
        }

    }
}
