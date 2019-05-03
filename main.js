/*_________________________________________*/
let buttonClass = "dCJp8 afkep _0mzm -";
let spanClass = "ltpMr Slqrh";
let downloadButton = "";
/*_________________________________________*/


main();

async function main() {

    let url = window.location.href;
    downloadButton = new Button(buttonClass, spanClass, url);

    while (true) {
        // checks if you are on the right page
        url = window.location.href;
        if (url.includes("instagram.com/p/")) {
            downloadButton.deleteButton();
            downloadButton.createLink();
            await sleep(100);
            downloadButton.createButton();
        }
        await sleep(100);
    }
}