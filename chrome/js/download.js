chrome.runtime.onMessage.addListener(function (message) {
    if (message.user.includes("HuiBuh")) {
        if(message.type.includes("image"))
            chrome.downloads.download({url: message.url, filename: "image.jpg"});
        else if (message.type.includes("video"))
            chrome.downloads.download({url: message.url, filename: "video.mp4"})
    }
});