const dlAllRootClass = "nZSzR";
const followButtonClass = "_5f5mN -fzfL _6VtSN yZn4P";
const dlAllImage = "v1Nh3 kIKUG _bz0w";
const dlAllLoader = "By4nA";
const dlAllStopClass = "_0mzm- sqdOP yWX7d";

let visited = false;

class DownloadAll {
    /**
     * Constructor
     */
    constructor() {
        this.downloadAllButton = "";
        this.modal = "";
        this.imageJSON = [];
        this.urls = [];
    }

    /**
     * Creates the button and the modal
     */
    createComponents() {
        this.createButton();
        this.createModal();
    }

    /**
     * Creates the download all Button
     */
    createButton() {
        let followStatus = document.getElementsByClassName(followButtonClass).length > 0;
        let root = document.getElementsByClassName(dlAllRootClass)[0];

        this.downloadAllButton = document.createElement("a");
        this.downloadAllButton.classList.add("ffKix");

        root.appendChild(this.downloadAllButton);

        let button = document.createElement("button");
        this.downloadAllButton.appendChild(button);
        if (followStatus) {
            button.classList.add("_5f5mN");
            button.classList.add("-fzfL");
            button.classList.add("_6VtSN");
            button.classList.add("yZn4P");
        } else {
            button.classList.add("_0mzm-");
            button.classList.add("sqdOP");
            button.classList.add("L3NKy");
        }
        button.style.marginLeft = ".2rem";
        button.innerText = "Download All";

        this.downloadAllButton.addEventListener("click", function () {
            downloadAllButton.modal.style.visibility = "visible";
            downloadAllButton.modal.style.opacity = "1";
        });

    }

    /**
     * Creates the modal which will be displayed if you click the download all button
     */
    createModal() {
        let body = document.body;

        this.modal = document.createElement("div");
        this.modal.classList.add("modal");
        this.modal["id"] = "modal";
        body.appendChild(this.modal);

        let modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");
        modalContent.id = "modal-content";
        modalContent.style.paddingBottom = "1.5rem";
        this.modal.appendChild(modalContent);

        let closeModal = document.createElement("span");
        closeModal.innerHTML = "&times";
        closeModal.classList.add("close");
        closeModal.onclick = function () {
            downloadAllButton.modal.style.visibility = "hidden";
            downloadAllButton.modal.style.opacity = "0";
        };
        modalContent.appendChild(closeModal);

        let heading = document.createElement("h1");
        heading.innerText = "Download All";
        heading.style.display = "flex";
        heading.style.fontSize = "1.3rem";
        heading.style.marginBottom = "1rem";
        heading.style.justifyContent = "left";
        modalContent.appendChild(heading);

        let hr = document.createElement("hr");
        hr.classList.add("modal-hr");
        modalContent.appendChild(hr);

        let text = document.createElement("p");
        text.innerHTML = "" +
            "<li> The page will automatically scroll down until all images are loaded. </li>" +
            "<li> Don´t Interrupt the Process. </li>" +
            "<li> All the images will be saved in a zip file. </li>" +
            "<li> Be aware that the process of the download and zip compression will take a while.</li>";
        text.classList.add("text");
        modalContent.appendChild(text);


        let cancelButton = document.createElement("button");
        cancelButton.style.cssFloat = "left";

        cancelButton.classList.add("_0mzm-");
        cancelButton.classList.add("sqdOP");
        cancelButton.classList.add("L3NKy");

        cancelButton.innerText = "Cancel";
        cancelButton.style.paddingRight = ".7rem";
        cancelButton.style.paddingLeft = ".7rem";

        cancelButton.onclick = function () {
            downloadAllButton.modal.style.visibility = "hidden";
            downloadAllButton.modal.style.opacity = "0";
        };
        modalContent.appendChild(cancelButton);


        let agreeButton = document.createElement("button");
        agreeButton.innerText = "Start";
        agreeButton.style.paddingLeft = ".7rem";
        agreeButton.style.paddingRight = ".7rem";

        agreeButton.classList.add("_0mzm-");
        agreeButton.classList.add("sqdOP");
        agreeButton.classList.add("L3NKy");

        agreeButton.style.cssFloat = "right";
        agreeButton.onclick = function () {
            downloadAllButton.modal.style.visibility = "hidden";
            downloadAllButton.modal.style.opacity = "0";
            sleep(10);
            downloadAllButton.start();
        };

        modalContent.appendChild(agreeButton);

        window.onclick = function (event) {
            if (event.target.id === "modal") {
                document.getElementById("modal").style.visibility = "hidden";
                document.getElementById("modal").style.opacity = "0";
            }
        };

    }

    /**
     * Start the video download
     */
    async start() {

        alert("The download starts. Please be patient event after the scrolling.");

        //scroll down and get the xhttp requests and the json
        await this.scrollDown();
        await this.requests(this.urls);

        while (this.urls.length > this.imageJSON.length) {
            await sleep(20);
        }

        let dlUrl = this.createDownloadImages();
        chrome.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh", "type": "bulk"});

        visited = false;
    }

    /**
     * Scrolls down until all images are collected and takes the links to the images
     */
    async scrollDown() {
        await sleep(10);
        while (document.getElementsByClassName(dlAllLoader).length > 0 || !visited) {
            visited = true;
            scrollBy(0, 10000);
            if (document.getElementsByClassName(dlAllStopClass).length > 0)
                return;
            await sleep(100);
            if (document.getElementsByClassName(dlAllStopClass).length > 0)
                return;
            this.fillUrls()
        }
    }

    /**
     * Gets the images and copies the links
     */
    async fillUrls() {
        let images = document.getElementsByClassName(dlAllImage);

        let part = null;
        for (var i = 0; i < images.length; ++i) {
            part = images[i].firstChild.getAttribute("href");
            if (!this.urls.includes("https://www.instagram.com" + part + "?__a=1"))
                this.urls.push("https://www.instagram.com" + part + "?__a=1");
        }
    }

    /**
     * make requests for the collected images
     * @param urls all the url that contain images which have to be "xhttp" and then downloaded
     */
    async requests(urls) {
        let url;

        for (let i = 0; i < urls.length; ++i) {

            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    let json = JSON.parse(xhttp.responseText);
                    downloadAllButton.imageJSON.push(json);
                }
            };
            url = urls[i];
            xhttp.open("GET", urls[i], true);
            xhttp.send();
        }
    }

    /**
     * creates the actual download image links
     * @returns {Array} links to the actual image files
     */
    createDownloadImages() {
        let json;
        let downloadURLs = [];
        for (let i = 0; i < this.imageJSON.length; ++i) {
            json = this.imageJSON[i];

            if (json["graphql"]["shortcode_media"]["__typename"].includes("Video")) {
                downloadURLs.push(json["graphql"]["shortcode_media"]["video_url"]);
            } else if (json["graphql"]["shortcode_media"]["__typename"].includes("Image")) {
                downloadURLs.push(json["graphql"]["shortcode_media"]["display_resources"]["2"]["src"])
            } else if (json["graphql"]["shortcode_media"]["__typename"].includes("GraphSidecar")) {
                for (let x = 0; x < json["graphql"]["shortcode_media"]["edge_sidecar_to_children"]["edges"].length; ++x) {
                    downloadURLs.push(json["graphql"]["shortcode_media"]["edge_sidecar_to_children"]["edges"][x]["node"]["display_url"]);
                }
            }
        }

        return downloadURLs
    }

    /**
     * removes the buttons
     */
    removeComponents() {
        try {
            this.downloadAllButton.remove();
            this.modal.remove();
        } catch (e) {
            console.log("Could not remove the download All components")
        }
    }


}