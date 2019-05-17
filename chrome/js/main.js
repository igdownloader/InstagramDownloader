/*_________________________________________*/
let buttonClass = "dCJp8 afkep _0mzm -";
let spanClass = "ltpMr Slqrh";
let pictureBox = "v1Nh3 kIKUG _bz0w";
let downloadButton = "";
let hoverableButton = "";
/*_________________________________________*/


// XHTTP erst ausführen, wenn man auf download klickt...
// Auf bestimmte Klassen überprüfen
main();

async function main() {

    let url;
    let oldUrl = "some random string";
    downloadButton = new Button(buttonClass, spanClass);

    let hoverPictures;
    let oldHover = 0;
    let i = 0;
    hoverableButton = new Hoverable(pictureBox);


    while (true) {
        // checks if you are on the right page
        url = window.location.href;
        hoverPictures = document.getElementsByClassName("v1Nh3 kIKUG  _bz0w");
        i = i + 1;
        if (url.includes("instagram.com/p/") && !url.includes(oldUrl) || i < 4) {
            await sleep(100);
            i = 0;
            oldUrl = url;
            downloadButton.deleteButton();
            downloadButton.createButton();
        } else if (url.includes("instagram.com/") && hoverPictures.length > 0 && hoverPictures.length !== oldHover) {
            await sleep(100);
            oldHover = hoverPictures.length;
            hoverableButton.removeHoverable();
            hoverableButton.createHoverable();
        }
        await sleep(100);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

