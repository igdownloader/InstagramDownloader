class DownloadStory {
    constructor() {
        this.downloadButton = null;
    }


    createButton() {

        let temp1 = document.getElementsByClassName("Igw0E _56XdI eGOV_ ybXk5 _4EzTm");
        let temp2 = document.getElementsByClassName("Igw0E _56XdI eGOV_ _4EzTm soMvl")[0].getElementsByClassName("yn6BW");

        let root = null;
        if (temp1.length > 0) {
            root = temp1[0];
        } else if (temp2.length > 0) {
            root = temp2[0];
        }
        this.downloadButton = document.createElement("div");
        let downloadImage = chrome.runtime.getURL("icons/download_multiple.png");
        this.downloadButton.style.backgroundImage = "url(" + downloadImage + ")";
        this.downloadButton.style.backgroundSize = "75%";
        this.downloadButton.style.backgroundRepeat = "no-repeat";
        this.downloadButton.style.backgroundPosition = "center";
        this.downloadButton.style.display = "inline-block";
        this.downloadButton.id = "story-download-button";
        this.downloadButton.style.width = "1.1rem";
        this.downloadButton.style.height = "1.1rem";
        this.downloadButton.style.marginLeft = ".4rem";
        this.downloadButton.style.cursor = "pointer";

        this.downloadButton.addEventListener("click", function () {
            storyDownload.issueDownload();
        });
        root.appendChild(this.downloadButton);
    }


    issueDownload() {
        let downloadPicture = document.getElementsByClassName("y-yJ5");

        let downloadVideo = document.getElementsByClassName("y-yJ5  OFkrO ");

        if (downloadPicture.length === 1) {
            downloadPicture = downloadPicture[0];
            let dlUrl = downloadPicture.src;
            chrome.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh", "type": "image"});
        } else if (downloadPicture.length === 3) {
            downloadPicture = downloadPicture[2].firstChild;
            let dlUrl = downloadPicture.src;
            chrome.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh", "type": "video"});
        }
    }


    removeButton() {
        try {
            this.downloadButton.remove();
        } catch (e) {
            console.log("Could not remove the story button");
        }
    }
}