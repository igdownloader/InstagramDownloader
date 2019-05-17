browser.runtime.onMessage.addListener(function (message) {

    if (message.user.includes("HuiBuh"))
        browser.downloads.download({url: message.url, filename: "image.jpg"})
});
