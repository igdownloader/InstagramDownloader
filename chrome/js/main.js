/*_________________________________________*/
let buttonClass = "dCJp8 afkep _0mzm -";
let spanClass = "ltpMr Slqrh";
let pictureBox = "v1Nh3 kIKUG _bz0w";
let downloadButton = "";

let hoverButton = "";

let profilePictureButton = "";
let profilePicture = "_6q-tv";

let downloadAllButton = "";

let storyDownload = "";
/*_________________________________________*/

main();

/***
 * Runs all the time on instagram and creates the download buttons
 */
async function main() {

    // create the variables and instances the download button object
    let url;
    let oldUrl = "some random string";
    let i = 0;
    downloadButton = new Button(buttonClass, spanClass);

    // creates the variables and instances the hover button
    let hoverPictures;
    let oldHover = 0;
    hoverButton = new Hoverable(pictureBox);
    profilePictureButton = new ProfilePicture(profilePicture);

    downloadAllButton = new DownloadAll();

    storyDownload = new DownloadStory();


    // check all the time
    while (true) {
        // get current url
        url = window.location.href.split('?')[0];
        // get all the pictures displayed
        hoverPictures = document.getElementsByClassName("v1Nh3 kIKUG  _bz0w");

        if (document.getElementsByClassName("dCJp8 afkep xqRnw _0mzm-").length > 0) {
            document.getElementsByClassName("dCJp8 afkep xqRnw _0mzm-")[0].click();
        }

        // XrOey

        if (url.includes("instagram.com/") && hoverPictures.length > 0 && hoverPictures.length !== oldHover) {

            if (document.getElementsByClassName("_7UhW9 fKFbl yUEEX KV-D4 fDxYl").length > 0) {
                profilePictureButton.removeDownloadButton();
                profilePictureButton.createHoverable();
                downloadAllButton.removeComponents();
                downloadAllButton.createComponents();

                oldHover = hoverPictures.length;
                hoverButton.removeHover();
                hoverButton.createHoverable();
            } else if (document.getElementsByClassName("XrOey").length > 0) {
                //main page download
            }


        } else if (url.includes("instagram.com/stories")) {
            if (document.getElementById("story-download-button") === null && document.getElementsByClassName("Igw0E _56XdI eGOV_ ybXk5 _4EzTm").length > 0)
                storyDownload.createButton();
        } else if (url.includes("instagram.com/p/") && !url.includes(oldUrl) && !oldUrl.includes(url) || i < 1) {
            if (document.getElementsByClassName("ltpMr Slqrh").length === 1) {
                i = 1;
                downloadButton.deleteButton();
                downloadButton.createButton();
            } else {
                i = 0;
            }
        }
        oldUrl = url;
        await sleep(10);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

