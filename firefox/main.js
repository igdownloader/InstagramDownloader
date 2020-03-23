const nameClass = "_7UhW9 fKFbl yUEEX KV-D4 fDxYl";
const editProfileClass = "_0mzm- sqdOP  L3NKy _4pI4F  _8A5w5    ";

/*_________________________________________*/
let downloadButton = "";
let hoverButton = "";
let profilePictureButton = "";
let downloadAllButton = "";
let storyDownload = "";
let homePageDownload = "";
/*_________________________________________*/

adjustAndroid();
main();

/***
 * Runs all the time on instagram and creates the download buttons
 */
async function main() {

    createSnackbar();

    try {
        // create the variables and instances the download button object
        let url;
        let oldUrl = "some random string";
        let i = 0;
        downloadButton = new Button(buttonClass);

        // creates the variables and instances the hover button
        let hoverPictures;
        let oldHoverPicture = 0;
        let hoverVideo;
        let oldHoverVideo = 0;
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
            hoverVideo = document.getElementsByClassName("_bz0w");


            if (document.getElementsByClassName("dCJp8 afkep xqRnw _0mzm-").length > 0) {
                document.getElementsByClassName("dCJp8 afkep xqRnw _0mzm-")[0].click();
            }


            if ((/.*instagram\.com\/$/.test(url))) {

                try {
                    // Normal
                    pictureBoxes = document.getElementsByClassName("cGcGK")[0].childNodes[0].firstChild;
                } catch (e) {
                    try {
                        pictureBoxes = document.getElementsByClassName("_1SP8R")[0].childNodes[1].childNodes[0].firstChild;
                    } catch (e) {
                        try {
                            // very zoomed in
                            pictureBoxes = document.getElementsByClassName("_1SP8R")[0].childNodes[2].firstChild.firstChild;
                        } catch (e) {
                            pictureBoxesOldTop = "-20px";
                            pictureBoxesOldBottom = "-20px";
                        }
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
                oldHoverPicture = -20;
                oldHoverVideo = -20;
                i = 0;
            } else if (url.includes("instagram.com/stories")) {
                if (document.getElementById("story-download-button") === null && document.getElementsByClassName("Igw0E _56XdI eGOV_ ybXk5 _4EzTm").length > 0
                    || document.getElementById("story-download-button") === null && document.getElementsByClassName("Igw0E _56XdI eGOV_ _4EzTm soMvl").length > 0)
                    storyDownload.createButton();

                pictureBoxesOldTop = "-20";
                pictureBoxesOldBottom = "-20";
                oldHoverPicture = -20;
                oldHoverVideo = -20;
                oldUrl = "heyyyyy";
                i = 0;

            } else if (url.includes("instagram.com/") && !url.includes("instagram.com/p/") && !(/.*instagram\.com.*\/tv\/.*/.test(url)) && !(/\/channel\/$/.test(url)) || (/\/saved\/$/.test(url)) || (/\/tagged\/$/.test(url))) {

                let a = document.getElementsByClassName(nameClass).length > 0;
                let b = hoverPictures.length > 0;
                let c = hoverPictures.length !== oldHoverPicture;

                let d = url.includes("instagram.com/explore/");
                let e = hoverPictures.length > 0;
                let f = hoverPictures.length !== oldHoverPicture;
                let g = document.getElementsByClassName(editProfileClass).length === 0;

                // man geht nicht immer in die
                if (a && b && c || d && e && f && g) {
                    if (document.getElementsByClassName("-vDIg").length > 0) {
                        profilePictureButton.removeDownloadButton();
                        profilePictureButton.createHoverable();
                        downloadAllButton.removeComponents();
                        downloadAllButton.createComponents();
                    }


                    oldHoverPicture = hoverPictures.length;
                    hoverButton.removeHover();
                    oldHoverVideo = -20;
                    hoverButton.createHoverable();
                }

                oldUrl = "heyyyy";
                pictureBoxesOldTop = "-20";
                pictureBoxesOldBottom = "-20";
                i = 0;

            } else if (url.includes("instagram.com/p/") && !url.includes(oldUrl) && !oldUrl.includes(url) && !/\/channel\/$/.test(url) ||
                url.includes("instagram.com/tv/") && !url.includes(oldUrl) && !oldUrl.includes(url) && !/\/channel\/$/.test(url) || i < 1 && !/\/channel\/$/.test(url)) {
                if (document.getElementsByClassName("ltpMr Slqrh").length === 1) {
                    i = 1;
                    downloadButton.deleteButton();
                    downloadButton.createButton();
                    if (document.getElementsByClassName("EtaWk").length > 0)
                        document.getElementsByClassName("EtaWk")[0].style.overflow = "hidden";
                } else {
                    i = 0;
                }

                pictureBoxesOldTop = "-20";
                pictureBoxesOldBottom = "-20";
                oldHoverVideo = -20;
                oldHoverPicture = -20;

            } else if (/\/channel\/$/.test(url)) {


                let a = document.getElementsByClassName(nameClass).length > 0;
                let b = hoverVideo.length > 0;
                let c = hoverVideo.length !== oldHoverVideo;

                let d = url.includes("instagram.com/explore/");
                let e = hoverVideo.length > 0;
                let f = hoverVideo.length !== oldHoverVideo;
                let g = document.getElementsByClassName(editProfileClass).length === 0;


                if (a && b && c || d && e && f && g) {
                    if (document.getElementsByClassName("-vDIg").length > 0) {
                        profilePictureButton.removeDownloadButton();
                        profilePictureButton.createHoverable();
                        downloadAllButton.removeComponents();
                        downloadAllButton.createComponents();
                    }

                    oldHoverVideo = hoverVideo.length;
                    hoverButton.removeHover();
                    hoverButton.createHoverable();
                }

                pictureBoxesOldTop = "-20";
                pictureBoxesOldBottom = "-20";
                oldHoverPicture = -20;
                i = 0;

            }
            oldUrl = url;
            await sleep(10);
        }
    } catch (e) {
        console.error(e);
        await sleep(1000);
        main()
    }
}

/**
 * Hide the hover icons if the mobile firefox is detected
 */
function adjustAndroid() {
    if (isMobile()) {
        let head = document.getElementsByTagName("head")[0];
        let style = document.createElement("style");
        style.id = "own-injected-mobile-style";
        style.innerText = "" +
            ".tv-middle, .middle {" +
            "    display: none!important;" +
            "}";
        head.appendChild(style);
    }
}

/**
 * Check if the browser is mobile
 * @returns {boolean} Is Mobile
 */
function isMobile() {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
}

/**
 * Create the snackbar
 */
function createSnackbar() {
    let root = document.getElementsByTagName("body")[0];
    let snackbar = document.createElement("div");
    snackbar.id = "snackbar";
    snackbar.innerText = "Default";
    root.appendChild(snackbar);
}

/**
 * Set the text of the formerly created snackbar
 * @param text The text that is supposed to be in the snackbar
 * @param duration How long should the snackbar be shown
 */
function showSnackbar(text, duration = 5000) {
    let snackbar = document.getElementById("snackbar");
    snackbar.innerText = text;
    snackbar.className = "show";
    setTimeout(() => {
        snackbar.classList.remove("show");
    }, duration);
}

/**
 * Sleep
 * @param ms How long the program should pause
 * @returns {Promise<>}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

