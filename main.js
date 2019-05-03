//ToDo api to download video
//add URL ?__a=1 to get the JSON

let buttonClass = "dCJp8 afkep _0mzm -";
let spanClass = "ltpMr Slqrh";

let parentElement;
let outerSpan;
let downloadButton;

let url;
let link;
let downloadLink;

main();

async function main() {


    while (true) {
        url = window.location.href;

        if (url.includes("instagram.com/p/")) {


            createDownloadLink();
            await sleep(400);
            createDownloadButton();
        }
        await sleep(100);
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function createDownloadLink() {

    url = url + "?__a=1";
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let json = JSON.parse(xhttp.responseText);
            link = checkForLink(json)
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send();
}


function checkForLink(json) {
    if ((json.graphql.shortcode_media.__typename).indexOf("Video") !== -1) {
        return (json.graphql.shortcode_media.video_url)
    } else if ((json.graphql.shortcode_media.__typename).indexOf("Image") !== -1) {
        return (json["graphql"]["shortcode_media"]["display_resources"]["2"]["src"])
    }
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

        let downloadImage = browser.runtime.getURL("icons/download.png");
        downloadButton.style.backgroundImage = "url(" + downloadImage + ")";

        downloadLink = link;

        downloadButton.href = downloadLink;
        downloadButton.className = buttonClass;
        downloadButton.style.backgroundSize = "75%";
        downloadButton.style.backgroundRepeat = "no-repeat";
        downloadButton.style.backgroundPosition = "center";
        downloadButton.style.display = "inline-block";
        downloadButton.style.marginBottom = "-1.75rem";
        downloadButton.style.opacity = "0.5";
        downloadButton.target = "_blank";

        outerSpan.appendChild(downloadButton);
    } catch {
        console.log("Could not create an element");
    }


}