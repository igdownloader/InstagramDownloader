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
    let check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
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
 */
function showSnackbar(text) {
    let snackbar = document.getElementById("snackbar");
    snackbar.innerText = text;
    snackbar.className = "show";
    setTimeout(function () {
        snackbar.className = snackbar.className.replace("show", "");
    }, 5000);
}

/**
 * Sleep
 * @param ms How long the program should pause
 * @returns {Promise<>}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

