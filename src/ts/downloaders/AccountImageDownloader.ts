/****************************************************************************************
 * Copyright (c) 2022. HuiiBuh                                                          *
 * This file (AccountImageDownloader.ts) is part of InstagramDownloader which is not released
 * under any licence.                                                                   *
 * Any usage of this code outside this project is not allowed.                          *
 ****************************************************************************************/

import * as browser from 'webextension-polyfill';
import { LogClassErrors } from '../decorators';
import { log } from '../functions';
import { DownloadMessage, DownloadType, LoggingLevel } from '../models/extension';
import { QuerySelectors } from '../QuerySelectors';
import { Downloader } from './Downloader';

/**
 * Downloader which can be used to download account images
 */
@LogClassErrors
export class AccountImageDownloader extends Downloader {

    /**
     * Download the account image
     */
    private static async downloadContent(): Promise<void> {
        const image = document.querySelector(QuerySelectors.accountImage) as HTMLImageElement | null;
        if (!image) {
            log('Could not find account image', LoggingLevel.error);
            return Promise.resolve();
        }

        const accountName: HTMLHeadingElement | null = document.querySelector(QuerySelectors.accountName);

        const downloadMessage: DownloadMessage = {
            imageURL: [image.src],
            accountName: accountName?.innerText || 'unknown',
            type: DownloadType.single,
        };
        await browser.runtime.sendMessage(downloadMessage);
    }

    /**
     * Create a new download button
     */
    public createDownloadButton(): void {
        const accountImageWrapper: HTMLElement = document.querySelector(QuerySelectors.accountImageWrapper) as HTMLElement;
        if (!accountImageWrapper) return;

        const downloadButton: HTMLAnchorElement = document.createElement('a');
        downloadButton.classList.add('h-v-center', 'account-download-button');
        downloadButton.onclick = AccountImageDownloader.downloadContent;
        accountImageWrapper.appendChild(downloadButton);

        const downloadImage: HTMLImageElement = document.createElement('img');
        downloadImage.src = browser.runtime.getURL('icons/download_white.png');
        downloadButton.appendChild(downloadImage);
    }

    /**
     * Reinitialize the downloader
     */
    public reinitialize(): void {
        this.remove();
        this.init();
    }

    /**
     * Remove the downloader
     */
    public remove(): void {
        super.remove('.account-download-button');
    }

}
