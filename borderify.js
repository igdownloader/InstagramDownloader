/*
Just draw a border round the document.body.
*/
url = window.location.href;


console.log("1")

if (url.includes("instagram.com/p/")) {
    console.log("2")


    pictureID = url.substr(25, (url.length - 2));
    getPictureURL = "https://instagr.am" + pictureID + "media/?size=l";

    console.log("3")
    var elem = document.createElement("a");
    elem.style = "position:fixed; width:60px; height:60px; bottom:40px; right:40px; background-color:#0C9; color:#FFF; border-radius:50px; text-align:center; box-shadow: 2px 2px 3px #999;"
    elem.style.fontSize = "30px";
    elem.href = getPictureURL;
    elem.download = pictureID;
    console.log("4")
    //elem.download = getPictureURL.substr(getPictureURL.lastIndexOf('/') + 1);
    //elem.click();

    document.body.appendChild(elem);
}
