/*_________________________________________*/
let buttonClass = "dCJp8 afkep _0mzm -";
let spanClass = "ltpMr Slqrh";
let pictureBox = "v1Nh3 kIKUG _bz0w";
let downloadButton = "";
let hoverButton = "";
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

    // check all the time
    while (true) {
        // get current url
        url = window.location.href.split('?')[0];
        // get all the pictures displayed
        hoverPictures = document.getElementsByClassName("v1Nh3 kIKUG  _bz0w");

        if (url.includes("instagram.com/") && hoverPictures.length > 0 && hoverPictures.length !== oldHover) {
            oldHover = hoverPictures.length;
            hoverButton.removeHoverable();
            hoverButton.createHoverable();
        }
        // if you clicked on a picture and the picture isn´t the same as before. But check at least 4 times
        else if (url.includes("instagram.com/p/") && !url.includes(oldUrl) && !oldUrl.includes(url) || i < 4) {
            if (!url.includes(oldUrl) && !oldUrl.includes(url))
                i = 0;
            i = i + 1;
            oldUrl = url;
            downloadButton.deleteButton();
            downloadButton.createButton();
        }
        await sleep(100);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

