chrome.runtime.onMessage.addListener(function (downloadLink) {
    if (downloadLink[1].includes("HuiBuh")){
        chrome.downloads.download({url: downloadLink[0], filename: "./image.jpg"});
    }
});