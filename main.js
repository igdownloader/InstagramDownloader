//der URL ?__a=1 hinzufügen um die JSON zu bekommen

var buttonClass = "dCJp8 afkep _0mzm -";
var spanClass = "ltpMr Slqrh";

var url;
var downloadLink;

main();

function main() {

    url = window.location.href;

    if (url.includes("instagram.com/p/")) {
        downloadLink = createDownloadLink();

        createDownloadButton();
        addOnclick();
    }
}

function addOnclick() {
    document.getElementById("downloadButton").addEventListener("click", function() {
        window.open(downloadLink);
    });
}

function createDownloadLink() {
    pictureID = url.substr(25, (url.length - 2));
    return "https://instagr.am" + pictureID + "media/?size=l";
}

function createDownloadButton() {
    let parentElement = document.getElementsByClassName(spanClass)[0];

    let outerSpan = document.createElement("span");
    parentElement.appendChild(outerSpan);

    let downloadButton = document.createElement("button");

    let dpwnloadImage = browser.runtime.getURL("icons/download.png");
    downloadButton.style.backgroundImage = "url(" + dpwnloadImage + ")";

    downloadButton.id = "downloadButton";
    downloadButton.className = buttonClass;
    downloadButton.style.backgroundSize = "75%";
    downloadButton.style.backgroundRepeat = "no-repeat";
    downloadButton.style.backgroundPosition = "center";
    downloadButton.style.display = "inline-block";
    downloadButton.style.marginTop = "3px";
    downloadButton.style.opacity = "0.5";

    outerSpan.appendChild(downloadButton);

}