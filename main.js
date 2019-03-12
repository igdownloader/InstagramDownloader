//ToDo api to download video
//add URL ?__a=1 to get the JSON

var buttonClass = "dCJp8 afkep _0mzm -";
var spanClass = "ltpMr Slqrh";

var parentElement;
var outerSpan;
var downloadButton;

var url;
var downloadLink;

main();

async function main() {
    while (true) {
        url = window.location.href;

        if (url.includes("instagram.com/p/")) {
            await sleep(500);
            createDownloadButton();
        }
        await sleep(100);
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createDownloadLink() {
    pictureID = url.substr(25, (url.length - 2));
    return "https://instagr.am" + pictureID + "media/?size=l";
}

function createDownloadButton() {
    try {
        outerSpan.remove();
    } catch {
        console.log("Could not remove the button");
    }

    try {
        parentElement = document.getElementsByClassName(spanClass)[0];

        outerSpan = document.createElement("span");
        parentElement.appendChild(outerSpan);

        downloadButton = document.createElement("a");

        let dpwnloadImage = browser.runtime.getURL("icons/download.png");
        downloadButton.style.backgroundImage = "url(" + dpwnloadImage + ")";

        downloadLink = createDownloadLink();

        downloadButton.href = downloadLink;
        downloadButton.className = buttonClass;
        downloadButton.style.backgroundSize = "75%";
        downloadButton.style.backgroundRepeat = "no-repeat";
        downloadButton.style.backgroundPosition = "center";
        downloadButton.style.display = "inline-block";
        downloadButton.style.paddingTop = "5px";
        downloadButton.style.opacity = "0.5";
        downloadButton.target = "_blank";

        outerSpan.appendChild(downloadButton);
    } catch {
        console.log("Could not create an element");
    }


}