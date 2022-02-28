/****************************************************************************************
 * Copyright (c) 2021. HuiiBuh                                                          *
 * This file (AccountImageDownloader.ts) is part of InstagramDownloader which is released under
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import { browser } from 'webextension-polyfill-ts';
import { LogClassErrors } from '../decorators';
import { DownloadMessage, DownloadType } from '../modles/extension';
import { QuerySelectors } from '../QuerySelectors';
import { makeAccountRequest } from './download-functions';
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
        const response = await makeAccountRequest(location.href);
        const pictureURL = response.profile_pic_url_hd;
        const accountName = response.username;

        const downloadMessage: DownloadMessage = {
            imageURL: [pictureURL],
            accountName,
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
