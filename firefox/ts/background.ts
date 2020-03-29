'use strict';

// @ts-ignore
browser.runtime.onMessage.addListener((message: DownloadMessage) => {

    if (message.type === ContentType.single) {
        downloadSingleImage(message);
    } else if (message.type === ContentType.bulk) {
        downloadBulk(message.imageURL);
    }

});

function downloadSingleImage(message: DownloadMessage): void {
    let imageName: string;
    // Get the image id
    if (message.type !== ContentType.bulk) {
        imageName = getImageId(message.imageURL[0]);
    }

    imageName = message.accountName + '_' + imageName;

    // @ts-ignore
    browser.downloads.download({
        url: message.imageURL[0],
        filename: imageName,
    });

}


function downloadBulk(urlList: string[]): void {
    // @ts-ignore
    const zip: JSZip = new JSZip();
    let count = 0;

    urlList.forEach((url: string) => {
        // loading a file and add it in a zip file
        // @ts-ignore
        JSZipUtils.getBinaryContent(url, (err, data) => {

            let filename: string = url.split('?')[0];
            filename = filename.split('/').pop();

            zip.file(filename, data, {binary: true});
            count++;
            if (count === urlList.length) {
                zip.generateAsync({type: 'blob'}).then(async (content: Blob) => {
                    const kindaUrl: string = window.URL.createObjectURL(content);
                    // @ts-ignore
                    const opened = await browser.tabs.create({url: kindaUrl});
                });
            }
        });
    });

}


/**
 * Gets the image name based on the url of the image
 * @param url the url of the image or video
 * @returns the image/video name
 */
function getImageId(url: string): string {
    return url.split('?')[0].split('/').pop().replace(/_/g, '');
}
