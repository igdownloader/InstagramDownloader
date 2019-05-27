/*_________________________________________*/


let downloadButton = "";

let hoverButton = "";

let profilePictureButton = "";

let downloadAllButton = "";

let storyDownload = "";

let homePageDownload = "";
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
    downloadButton = new Button(buttonClass);

    // creates the variables and instances the hover button
    let hoverPictures;
    let oldHover = 0;
    hoverButton = new Hoverable();
    profilePictureButton = new ProfilePicture();

    downloadAllButton = new DownloadAll();

    storyDownload = new DownloadStory();

    homePageDownload = new DownloadHomePage();
    let pictureBoxesOldTop = "-20px";
    let pictureBoxesOldBottom = "-20px";
    let pictureBoxes = null;

    // check all the time
    while (true) {
        // get current url
        url = window.location.href.split('?')[0];
        // get all the pictures displayed
        hoverPictures = document.getElementsByClassName("v1Nh3 kIKUG  _bz0w");

        if (document.getElementsByClassName("dCJp8 afkep xqRnw _0mzm-").length > 0) {
            document.getElementsByClassName("dCJp8 afkep xqRnw _0mzm-")[0].click();
        }


        if ((/.*instagram\.com\/$/.test(url))) {

            try {
                pictureBoxes = document.getElementsByClassName("_1SP8R")[0].childNodes[1].childNodes[1].firstChild;

            } catch (e) {
                try {
                    pictureBoxes = document.getElementsByClassName("cGcGK")[0].childNodes[1].firstChild;
                } catch (e) {
                    pictureBoxesOldTop = "-20px";
                    pictureBoxesOldBottom = "-20px";
                }
            }

            if (document.getElementsByClassName("yOZjD _80tAB").length === 0 && pictureBoxes !== null && pictureBoxes.style.paddingTop !== pictureBoxesOldTop ||
                document.getElementsByClassName("yOZjD _80tAB").length === 0 && pictureBoxes !== null && pictureBoxes.style.paddingBottom !== pictureBoxesOldBottom) {
                homePageDownload.removeButtons();
                homePageDownload.createButtons();
                pictureBoxesOldTop = pictureBoxes.style.paddingTop;
                pictureBoxesOldBottom = pictureBoxes.style.paddingBottom;
            }

            oldUrl = "heyyyy";
            oldHover = -20;
            i = 0;
        } else if (url.includes("instagram.com/stories")) {
            if (document.getElementById("story-download-button") === null && document.getElementsByClassName("Igw0E _56XdI eGOV_ ybXk5 _4EzTm").length > 0
                || document.getElementById("story-download-button") === null && document.getElementsByClassName("Igw0E _56XdI eGOV_ _4EzTm soMvl").length > 0)
                storyDownload.createButton();

            pictureBoxesOld = "-20";
            oldUrl = "heyyyyy";
            i = 0;

        } else if (url.includes("instagram.com/") && !url.includes("instagram.com/p/") && !url.includes("instagram.com/tv/") && !(/\/channel\/$/.test(url))) {
            if (document.getElementsByClassName("_7UhW9 fKFbl yUEEX KV-D4 fDxYl").length > 0 && hoverPictures.length > 0
                && hoverPictures.length !== oldHover && document.getElementsByClassName("_0mzm- sqdOP  L3NKy _4pI4F _8A5w5").length === 0
                || url.includes("instagram.com/explore/") && hoverPictures.length > 0 && hoverPictures.length !== oldHover
                && document.getElementsByClassName("_0mzm- sqdOP  L3NKy _4pI4F  _8A5w5    ").length === 0) {

                if (document.getElementsByClassName("-vDIg").length > 0) {
                    profilePictureButton.removeDownloadButton();
                    profilePictureButton.createHoverable();
                    downloadAllButton.removeComponents();
                    downloadAllButton.createComponents();
                }


                oldHover = hoverPictures.length;
                hoverButton.removeHover();
                hoverButton.createHoverable();
            }

            oldUrl = "heyyyy";
            pictureBoxesOld = "-20px";
            i = 0;
        } else if (url.includes("instagram.com/p/") && !url.includes(oldUrl) && !oldUrl.includes(url) ||
            url.includes("instagram.com/tv/") && !url.includes(oldUrl) && !oldUrl.includes(url) || i < 1) {
            if (document.getElementsByClassName("ltpMr Slqrh").length === 1) {
                i = 1;
                downloadButton.deleteButton();
                downloadButton.createButton();
                if (document.getElementsByClassName("EtaWk").length > 0)
                    document.getElementsByClassName("EtaWk")[0].style.overflow = "hidden";
            } else {
                i = 0;
            }

            pictureBoxesOld = "-20px";
            oldHover = -20;

        }
        oldUrl = url;
        await sleep(10);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

