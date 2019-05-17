chrome.runtime.onMessage.addListener(function (message) {
    if (message.user.includes("HuiBuh")) {
        chrome.downloads.download({url: message.url, filename: "./image.jpg"});
    }
});