/****************************************************************************************
 * Copyright (c) 2022. HuiiBuh                                                          *
 * This file (BackgroundMessageHandler.ts) is part of InstagramDownloader which is not released
 * under any licence.                                                                   *
 * Any usage of this code outside this project is not allowed.                          *
 ****************************************************************************************/

import * as browser from 'webextension-polyfill';
import { singleton } from '../decorators';
import { AlertMessage, DownloadMessage, DownloadProgress, DownloadType } from '../models/extension';
import { isDownloadProgress } from '../models/typeguards';
import { downloadBulk, downloadSingleImage } from './download';
import type { Runtime } from 'webextension-polyfill';

@singleton
export class BackgroundMessageHandler {

    private lastMessageSent = new Date().getTime();

    public constructor() {
        browser?.runtime?.onInstalled?.addListener(BackgroundMessageHandler.onUpdate);
        browser?.runtime?.onMessage?.addListener(BackgroundMessageHandler.onMessage);
    }

    private static async onUpdate(details: Runtime.OnInstalledDetailsType): Promise<void> {
        if (details?.reason !== 'update') return;
        //
        // const options = browser.runtime.getURL('options.html');
        // await browser.tabs.create({
        //     url: options,
        // });
    }

    private static async onMessage(message: DownloadMessage): Promise<void> {
        if (message.type === DownloadType.single) {
            await downloadSingleImage(message);
        } else if (message.type === DownloadType.bulk) {
            await downloadBulk(message.imageURL, message.accountName);
        }
    }

    /**
     * Send a message every second. If more messages are passed to this method the message will be discarded
     * @param message The message which should be sent
     * @param url The urls of the browser tabs the message should be sent to
     */
    public async sendMessage(message: DownloadProgress | AlertMessage, url: string = '*://*.instagram.com/*'): Promise<void> {
        if (isDownloadProgress(message)) {
            const timestamp = new Date().getTime();
            if (timestamp - this.lastMessageSent < 1000 && !message.isLast && !message.isFirst) return;
            this.lastMessageSent = timestamp;
        }

        const tabList = await browser.tabs.query({url});

        for (const tab of tabList) {
            if (tab.id) browser.tabs.sendMessage(tab.id, message);
        }
    }

}

// @ts-ignore
const messageHandler = new BackgroundMessageHandler();
