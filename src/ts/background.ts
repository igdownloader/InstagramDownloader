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
    // Get the image id
    let imageName = getImageId(message.imageURL[0]);
    imageName = message.accountName + '_' + imageName;

    // @ts-ignore
    browser.downloads.download({
        url: message.imageURL[0],
        filename: imageName,
    });

}

function downloadBulk(urls: string[]): void {
    // @ts-ignore
    const zip = new JSZip();
    let count = 0;

    urls.forEach((url: string) => {
        // loading a file and add it in a zip file
        // @ts-ignore
        const oReq = new XMLHttpRequest();
        oReq.open('GET', url, true);
        oReq.responseType = 'blob';

        oReq.onload = async () => {
            const blob = oReq.response;
            zip.file(getImageId(url), blob, {binary: true});

            ++count;
            if (count === urls.length) {
                const downloadZIP = await zip.generateAsync({type: 'blob'});
                const kindaUrl = window.URL.createObjectURL(downloadZIP);
                // @ts-ignore
                browser.downloads.download({
                    url: kindaUrl,
                    filename: 'bulk_download.zip',
                });
            }
        };

        oReq.send();

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
