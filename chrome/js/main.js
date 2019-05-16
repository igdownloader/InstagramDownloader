/*_________________________________________*/
let buttonClass = "dCJp8 afkep _0mzm -";
let spanClass = "ltpMr Slqrh";
let pictureBox = "v1Nh3 kIKUG _bz0w";
let downloadButton = "";
let hoverableButton = "";
/*_________________________________________*/


// XHTTP erst ausführen, wenn man auf download klickt...
main();

async function main() {

    let url;
    let oldUrl = "some random string";
    downloadButton = new Button(buttonClass, spanClass);

    let hoverPictures;
    let oldHover = [];
    hoverableButton = new Hoverable(pictureBox);


    while (true) {
        // checks if you are on the right page
        url = window.location.href;
        hoverPictures = document.getElementsByClassName("v1Nh3 kIKUG  _bz0w");
        let i = 0;
        if (url.includes("instagram.com/p/") && url.includes(oldUrl) || url.includes("instagram.com/p/")) {
            await sleep(100);
            oldUrl = url;
            //i = 0;
            downloadButton.createLink(url);
            downloadButton.deleteButton();
            downloadButton.createButton();
        } else if (url.includes("instagram.com/") && hoverPictures.length > 0 && hoverPictures.length != oldHover) {
            await sleep(100);
            oldHover = hoverPictures.length;
            hoverableButton.removeHoverable();
            hoverableButton.createHoverable();
            hoverableButton.createLink();
        }
        await sleep(100);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

