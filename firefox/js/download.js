browser.runtime.onMessage.addListener(function (message) {
    if (message.user.includes("HuiBuh")) {
        if(message.type.includes("image"))
            browser.downloads.download({url: message.url, filename: "image.jpg"});
        else if (message.type.includes("video"))
            browser.downloads.download({url: message.url, filename: "video.mp4"})
    }
});