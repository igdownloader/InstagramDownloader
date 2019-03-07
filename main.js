var elem;
var url;
var downloadLink;
console.log
main();

async function main() {
    while (true) {
        url = window.location.href;

        if (url.includes("instagram.com/p/")) {
            downloadLink = createDownloadLink();
            if (typeof elem == "undefined") {
                createDownloadButton();
                addOnclick();
            } else{
                elem.style.display = "block";
            }
        } else {
            if (typeof elem != "undefined"){
                elem.style.display = "none";
            }
                
        }
        await sleep(100);
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addOnclick() {
    document.getElementById("downloadbutton").addEventListener("click", function () {
        console.log("sdf")
        window.open(downloadLink);
    });
}

function createDownloadLink() {
    pictureID = url.substr(25, (url.length - 2));
    return "https://instagr.am" + pictureID + "media/?size=l";
}

function createDownloadButton() {
    elem = document.createElement("a");
    elem.style.display = "show";
    elem.style = "position:fixed; width:60px; height:60px; bottom:20px; right:20px; background-color:#3897f0; color:#FFF; border-radius:50px; text-align:center;"
    elem.style.fontSize = "30px";
    elem.style.zIndex = "2147483647"
    elem.id = "downloadbutton";
    document.body.appendChild(elem);
}7
