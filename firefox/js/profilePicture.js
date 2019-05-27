const profilePictureClass = "_6q-tv";

class ProfilePicture {
    /***
     * Creates a hover download button on the main page
     * @param profilePictureClass Class the button gets appended to
     */
    constructor(profilePictureClass) {
        this.downloadButton = "";
    }

    /**
     * Creates all hover button
     */
    createHoverable() {
        let profilePictureImage = document.getElementsByClassName(profilePictureClass)[0];

        let divProfileOverlay = document.createElement("div");
        divProfileOverlay.classList.add("profile-middle");
        divProfileOverlay.id = "profile-middle";


        let downloadImage = browser.runtime.getURL("icons/download_multiple.png");

        let profileHover = document.createElement("a");
        profileHover.style.backgroundImage = "url(" + downloadImage + ")";
        profileHover.style.backgroundSize = "42%";
        profileHover.style.backgroundRepeat = "no-repeat";
        profileHover.style.backgroundPosition = "center";
        profileHover.style.display = "inline-block";
        profileHover.style.cursor = "pointer";
        profileHover.classList.add("button");
        divProfileOverlay.appendChild(profileHover);

        profileHover.addEventListener("click", function () {
            profilePictureButton.issueDownload(profilePictureImage.src);
        });

        this.downloadButton = divProfileOverlay;
        profilePictureImage.parentNode.insertBefore(divProfileOverlay, profilePictureImage.nextSibling);
    }

    /***
     * After a click event on the button a xhttp request is executed and a message with the download url send to the
     * download.js background script
     */
    issueDownload(dlUrl) {
        browser.runtime.sendMessage({"url": dlUrl, "user": "HuiBuh", "type": "image"});
    }


    /***
     * removes all the hover button
     */
    removeDownloadButton() {
        try {
            this.downloadButton.remove();
        } catch (e) {
            console.log("Could not remove the profile download button")
        }
    }
}