/*_________________________________________*/
let buttonClass = "dCJp8 afkep _0mzm -";
let spanClass = "ltpMr Slqrh";
let downloadButton = "";
/*_________________________________________*/


main();

async function main() {

    let url = window.location.href;
    let oldUrl = "some random string"
    downloadButton = new Button(buttonClass, spanClass);

    while (true) {
        // checks if you are on the right page
        url = window.location.href;
        i = 0;
        if (url.includes("instagram.com/p/") && url.localeCompare(oldUrl) !== 0 || i < 4 && url.includes("instagram.com/p/")) {
            oldUrl = url;
            i = 0;
            downloadButton.createLink(url);
            await sleep(100);
            downloadButton.deleteButton();
            downloadButton.createButton();
        }
        await sleep(100);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

