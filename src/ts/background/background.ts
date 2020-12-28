/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (background.ts) is part of InstagramDownloader which is released under     *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import * as JSZip from 'jszip';
import { browser, Tabs } from 'webextension-polyfill-ts';
import { DownloadMessage, DownloadProgress, DownloadType } from '../modles/messages';
import Tab = Tabs.Tab;

browser.runtime.onInstalled.addListener(async () => {
    const options = browser.runtime.getURL('options.html');
    try {
        const response = (await fetch(options));
        console.log(response);
    } catch (e) {
        console.log(e);
    }

    await browser.tabs.create({
        url: options,
    });
});

browser.runtime.onMessage.addListener(async (message: DownloadMessage) => {

    if (message.type === DownloadType.single) {
        await downloadSingleImage(message);
    } else if (message.type === DownloadType.bulk) {
        downloadBulk(message.imageURL, message.accountName);
    }
});

async function downloadSingleImage(message: DownloadMessage): Promise<void> {
    // Get the image id
    let imageName = getImageId(message.imageURL[0]);
    imageName = `${message.accountName}_${imageName}`;

    await browser.downloads.download({
        url: message.imageURL[0],
        filename: imageName,
    });

}

async function downloadBulk(urls: string[], accountName: string): Promise<void> {
    const zip: JSZip = new JSZip();
    let count = 0;

    const instagramTabs = await browser.tabs.query({
        url: '*://*.instagram.com/*',
    });

    for (const url of urls) {
        fetch(url)
            .then(async response => {
                zip.file(getImageId(url), await response.blob(), {binary: true});
            }).finally(async () => {
            count += 1;

            updateProgress(count, urls.length, instagramTabs);

            if (count === urls.length) {
                await downloadZIP(zip, accountName);
            }
        }).catch(e => {
            const blob = new Blob([`Request did not succeed. If you are using Firefox go into you privacy settings ans select the
                standard setting (https://support.mozilla.org/en-US/kb/content-blocking). If that is not the problem you tried to download to many images
                and instagram has blocked you temporarily.\n\n`, e.toString()]);
            zip.file('error_read_me.txt', blob, {binary: true});
        });
    }
}

function updateProgress(progress: number, total: number, tabList: Tab[]): void {

    for (const tab of tabList) {

        const message: DownloadProgress = {
            total,
            progress,
            last: total === progress,
            first: progress === 1,
        };

        if (tab.id) {
            browser.tabs.sendMessage(tab.id, message);
        }
    }

}

/**
 * Download the zip file
 * @param zip The JSZip file which should be downloaded
 * @param accountName The account name
 */
async function downloadZIP(zip: JSZip, accountName: string): Promise<void> {
    const dZIP = await zip.generateAsync({type: 'blob'});
    const kindaUrl = window.URL.createObjectURL(dZIP);

    if (accountName) {
        await browser.downloads.download({
            url: kindaUrl,
            filename: `${accountName}.zip`,
        });
    } else {
        await browser.downloads.download({
            url: kindaUrl,
            filename: 'bulk_download.zip',
        });
    }

}

/**
 * Gets the image name based on the url of the image
 * @param url the url of the image or video
 * @returns the image/video name
 */
function getImageId(url: string): string {
    // tslint:disable-next-line:no-non-null-assertion
    return url.split('?')[0]!.split('/').pop()!.replace(/_/g, '');
}
