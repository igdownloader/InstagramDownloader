/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (background.ts) is part of InstagramDownloader which is released under     *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

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
    const zip: JSZip = new JSZip();
    let count = 0;

    urls.forEach((url: string) => {
        // loading a file and add it in a zip file
        const oReq = new XMLHttpRequest();
        oReq.open('GET', url, true);
        oReq.responseType = 'blob';

        oReq.onreadystatechange = async () => {
            if (XMLHttpRequest.DONE === oReq.readyState && oReq.status === 200) {
                const blob = oReq.response;
                zip.file(getImageId(url), blob, {binary: true});

                ++count;
            } else if (XMLHttpRequest.DONE === oReq.readyState) {
                ++count;
                const text = ['Request did not succeed.\n',
                    'If you are using Firefox go into you privacy settings ans select the standard setting (https://support.mozilla.org/en-US/kb/content-blocking). \n',
                    'If that is not the problem you tried to download to many images and instagram has blocked you temporarily.\n'];
                const blob = new Blob(text);

                zip.file('error_read_me.txt', blob, {binary: true});
            }

            if (count === urls.length) {
                await downloadZIP(zip);
            }
        };

        oReq.send();

    });

}

/**
 * Download the zip file
 * @param zip The JSZip file which should be downloaded
 */
async function downloadZIP(zip: any): Promise<void> {
    const dZIP = await zip.generateAsync({type: 'blob'});
    const kindaUrl = window.URL.createObjectURL(dZIP);
    // @ts-ignore
    browser.downloads.download({
        url: kindaUrl,
        filename: 'bulk_download.zip',
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
