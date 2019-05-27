const homepagePictureClassLarge = "_8Rm4L M9sTE h0YNM SgTZ1";
const homepagePictureClassSmall = "_8Rm4L M9sTE L_LMM SgTZ1   ePUX4";

const homepageAnchorClass = "ltpMr Slqrh";
const homepageButtonClass = "dCJp8 afkep _0mzm-";

const homepagePictureClass = "FFVAD";
const homepageVideoClass = "tWeCl";
const homepageSliderClass = "_-1_m6";

const homepageSliderDownloadClass = "c-Yi7";

class DownloadHomePage {
    constructor() {
        this.buttons = [];
    }

    createButtons() {
        let temp1 = document.getElementsByClassName(homepagePictureClassLarge);
        let temp2 = document.getElementsByClassName(homepagePictureClassSmall);
        let pictureBoxes = null;
        if (temp1.length > 0) {
            pictureBoxes = temp1;
        } else if (temp2.length > 0) {
            pictureBoxes = temp2;
        }

        for (let i = 0; i < pictureBoxes.length; ++i) {
            let parentElement = pictureBoxes[i];
            let root = parentElement.getElementsByClassName(homepageAnchorClass)[0];

            this.buttons.push(document.createElement("span"));
            let position = this.buttons.length - 1;

            this.buttons[position].style.paddingTop = ".18rem";
            this.buttons[position].id = "span?download-button-" + position.toString();
            this.buttons[position].addEventListener("click", this.issueDownload);


            parentElement.id = "download-button-" + position.toString();
            root.appendChild(this.buttons[position]);

            let outerButton = document.createElement("button");
            outerButton.className = homepageButtonClass;
            this.buttons[position].appendChild(outerButton);

            let buttonEmbedded = document.createElement("span");
            let downloadImage = browser.runtime.getURL("icons/download.png");
            buttonEmbedded.style.backgroundImage = "url(" + downloadImage + ")";

            buttonEmbedded.className = homepageButtonClass;
            buttonEmbedded.style.backgroundSize = "75%";
            buttonEmbedded.style.backgroundRepeat = "no-repeat";
            buttonEmbedded.style.backgroundPosition = "center";
            buttonEmbedded.style.display = "inline-block";
            buttonEmbedded.style.opacity = "0.5";
            outerButton.appendChild(buttonEmbedded);
        }
    }

    issueDownload(event) {
        let parentId = event.currentTarget.id.split("?")[1];
        let parent = document.getElementById(parentId);

        let dlUrl = "";

        let videoDownload = parent.getElementsByClassName(homepageVideoClass);
        let imageDownload = parent.getElementsByClassName(homepagePictureClass);
        let sliderDownload = parent.getElementsByClassName(homepageSliderClass);

        if (typeof (videoDownload) !== "undefined" && videoDownload.length > 0 && sliderDownload.length === 0) {
            dlUrl = videoDownload[0].src;
            browser.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh", "type": "video"});
        } else if (typeof (imageDownload) !== "undefined" && imageDownload.length > 0 && sliderDownload.length === 0) {
            dlUrl = imageDownload[0].src;
            browser.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh", "type": "image"});
        } else if (typeof (sliderDownload) !== "undefined" && sliderDownload.length > 0) {
            let url = parent.getElementsByClassName(homepageSliderDownloadClass)[0].href;

            url = url + "?__a=1";

            //ToDo Bei überprüfen der klasse nach rechts und links wird nicht immer die Mitte erkannt (mehr als 3 Elemente)
            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {

                    // get the json of the picture
                    let dlUrl = null;
                    let json = JSON.parse(xhttp.responseText);

                    var pictureSlider = [];
                    let imageSlide = null;
                    let videoSlide = null;
                    //all the pictures/videos in the slide
                    let allContent = parent.getElementsByClassName(homepageSliderClass);

                    //for each line check if there is a picture or a video in it and get the Class
                    for (var i = 0; i < allContent.length; ++i) {
                        imageSlide = allContent[i].getElementsByClassName(homepagePictureClass);
                        videoSlide = allContent[i].getElementsByClassName(homepageVideoClass);
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
                            if (pictureSlider[0][0].src.includes(json["graphql"]["shortcode_media"]["edge_sidecar_to_children"]["edges"][0]["node"]["display_url"])) {
                                dlUrl = pictureSlider[0][0].src;
                                browser.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh", "type": "image"});
                                return

                            }
                        } else if (pictureSlider[0][0].tagName.includes("VIDEO")) {
                            if (parent.getElementsByClassName("coreSpriteRightChevron").length > 0) {
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
            };

            xhttp.open("GET", url, true);
            xhttp.send();
        }
    }

    removeButtons() {
        try {
            for (let i = 0; i < this.buttons.length; ++i)
                this.buttons[i].remove();
            this.buttons = [];
        } catch (e) {
            this.buttons = [];
            console.log("Could not remove the button")
        }
    }

}
