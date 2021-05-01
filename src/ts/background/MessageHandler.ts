/****************************************************************************************
 * Copyright (c) 2021. HuiiBuh                                                          *
 * This file (MessageHandler.ts) is part of InstagramDownloader which is released under *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import { browser, Runtime } from 'webextension-polyfill-ts';
import { singleton } from '../decorators';
import { DownloadMessage, DownloadProgress, DownloadType } from '../modles/extension';
import { downloadBulk, downloadSingleImage } from './download';
import OnInstalledDetailsType = Runtime.OnInstalledDetailsType;

@singleton
export class MessageHandler {

    private lastMessageSent = new Date().getTime();

    public constructor() {
        browser.runtime.onInstalled.addListener(MessageHandler.onUpdate);
        browser.runtime.onMessage.addListener(MessageHandler.onMessage);
    }

    private static async onUpdate(reason: OnInstalledDetailsType): Promise<void> {
        if (reason.reason !== 'update') return;

        const options = browser.runtime.getURL('options.html');
        await browser.tabs.create({
            url: options,
        });
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
    public async sendMessage(message: DownloadProgress, url: string = '*://*.instagram.com/*'): Promise<void> {
        const timestamp = new Date().getTime();
        if (timestamp - this.lastMessageSent < 1000 && !message.isLast && !message.isFirst) return;

        this.lastMessageSent = timestamp;
        const tabList = await browser.tabs.query({url});

        for (const tab of tabList) {
            if (tab.id) browser.tabs.sendMessage(tab.id, message);
        }
    }

}

// @ts-ignore
const messageHandler = new MessageHandler();
