'use strict';

// @ts-ignore
browser.runtime.onMessage.addListener((message: DownloadMessage) => {

    console.log('Hallo welt');
    let imageName: string;
    // Get the image id
    if (message.type !== ContentType.bulk) {
        imageName = getImageId(message.imageURL);
    }

    imageName = message.accountName + '_' + imageName;

    // @ts-ignore
    browser.downloads.download({
        url: message.imageURL,
        filename: imageName,
    });

});

/**
 * Gets the image name based on the url of the image
 * @param url the url of the image or video
 * @returns the image/video name
 */
function getImageId(url: string): string {
    return url.split('?')[0].split('/').pop().replace(/_/g, '');
}
