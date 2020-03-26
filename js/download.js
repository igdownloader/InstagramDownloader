browser.runtime.onMessage.addListener(function (message) {

    /**
     * Gets the image name based on the url of the image
     * @param url the url of the image or video
     * @returns {string} the image/video name
     */
    function getImageId(url) {
        let fileName = url.split("?")[0];
        let length = fileName.split("/").length - 1;
        fileName = fileName.split("/")[length].replace(/_/g, "");
        return fileName
    }

    // Check if the download command was send by HuiBuh
    if (message.user.includes("HuiBuh")) {

        // Get the image id
        if (!message.type.includes("bulk")) {
            var name = getImageId(message.url);
        }

        // Append the filename to the account name
        if (message.hasOwnProperty("accountName")) {
            name = message.accountName + "_" + name;
        }

        if (message.type.includes("image"))
            browser.downloads.download({
                url: message.url,
                filename: name,
            });
        else if (message.type.includes("video"))
            browser.downloads.download({
                url: message.url,
                filename: name,
            });
        else if (message.type.includes("bulk"))
            downloadBulk(message.url)
    }
});


function downloadBulk(urls) {
    var zip = new JSZip();
    var count = 0;

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
