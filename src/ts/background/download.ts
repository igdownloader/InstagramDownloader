/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (download.ts) is part of InstagramDownloader which is released under     *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import * as JSZip from 'jszip';
import { browser } from 'webextension-polyfill-ts';
import { DownloadMessage, Metadata } from '../modles/extension';
import { MessageHandler } from './MessageHandler';

export async function downloadSingleImage(message: DownloadMessage): Promise<void> {
    // Get the image id
    let imageName = getImageId(message.imageURL[0]);
    imageName = `${message.accountName}_${imageName}`;

    const headers = [];
    // Check if the user uses firefox
    if ((window as { browser: object }).browser) headers.push({name: 'Referer', value: 'https://www.instagram.com/'});

    await browser.downloads.download({
        url: message.imageURL[0],
        filename: imageName,
        headers,
    });

}

export function downloadBulk(urls: string[], accountName: string): void {
    const zip: JSZip = new JSZip();
    let imageIndex = 0;

    for (const url of urls) {
        fetch(url)
            .then(async response => {
                zip.file(getImageId(url), await response.blob(), {binary: true});
            }).catch(e => {
            const blob = new Blob([`Request did not succeed. If you are using Firefox go into you privacy settings ans select the
                standard setting (https://support.mozilla.org/en-US/kb/content-blocking). If that is not the problem you tried to download to many images
                and instagram has blocked you temporarily.\n\n`, e.toString()]);
            zip.file('error_read_me.txt', blob, {binary: true});
        }).finally(async () => {
            imageIndex += 1;

            await new MessageHandler().sendMessage({
                percent: Number((imageIndex / urls.length).toFixed(2)),
                isFirst: imageIndex === 1,
                isLast: imageIndex === urls.length,
                type: 'download',
            });

            if (imageIndex === urls.length) {
                await downloadZIP(zip, accountName);
            }
        });
    }
}

/**
 * Download the zip file
 * @param zip The JSZip file which should be downloaded
 * @param accountName The account name
 */
export async function downloadZIP(zip: JSZip, accountName: string): Promise<void> {
    let isFirst = true;
    const dZIP = await zip.generateAsync({type: 'blob'}, (u: Metadata) => {
        new MessageHandler().sendMessage({
            percent: Number(u.percent.toFixed(2)),
            isFirst,
            isLast: u.percent === 100,
            type: 'compression',
        });
        isFirst = false;
    });

    const kindaUrl = window.URL.createObjectURL(dZIP);

    if (accountName) {
        await browser.downloads.download({url: kindaUrl, filename: `${accountName}.zip`});
    } else {
        await browser.downloads.download({url: kindaUrl, filename: 'bulk_download.zip'});
    }

}

/**
 * Gets the image name based on the url of the image
 * @param url the url of the image or video
 * @returns the image/video name
 */
function getImageId(url: string): string {
    // tslint:disable-next-line:no-non-null-assertion
    return url.split('?')[0]!.split('/').pop()!;
}
