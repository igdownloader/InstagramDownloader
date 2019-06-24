browser.runtime.onMessage.addListener(function (message) {
    if (message.user.includes("HuiBuh")) {
        if (message.type.includes("image"))
            browser.downloads.download({url: message.url, filename: "image.jpg"});
        else if (message.type.includes("video"))
            browser.downloads.download({url: message.url, filename: "video.mp4"});
        else if (message.type.includes("bulk"))
            downloadBulk(message.url)
    }
});


function downloadBulk(urls) {

    var zip = new JSZip();
    var count = 0;
    let zipFilename = "pictures.zip";

    urls.forEach(function (url) {
        // loading a file and add it in a zip file
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if (err) {
                throw err;
            }

            let filename = url.split('?')[0];
            filename = filename.split("/");
            filename = filename[filename.length - 1];

            zip.file(filename, data, {binary: true});
            count++;
            if (count === urls.length) {
                zip.generateAsync({type: 'blob'}).then(function (content) {
                    let kindaUrl = window.URL.createObjectURL(content);
                    let opened = browser.tabs.create({url: kindaUrl});

                    opened.then(function (value) {
                        // browser.tabs.remove(value.id)
                    });
                });
            }
        });
    });

}