/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (AccountImageDownloader.ts) is part of InstagramDownloader which is released under
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import { browser } from 'webextension-polyfill-ts';
import { DownloadMessage, DownloadType } from '../modles/messages';
import { Variables } from '../Variables';
import { Downloader } from './Downloader';

/**
 * Downloader which can be used to download account images
 */
export class AccountImageDownloader extends Downloader {

    /**
     * Create a new download button
     */
    public createDownloadButton(): void {
        const accountImageWrapper: HTMLElement = document.querySelector(Variables.accountImageWrapperClass) as HTMLElement;
        if (!accountImageWrapper) return;

        const downloadButton: HTMLAnchorElement = document.createElement('a');
        downloadButton.classList.add('h-v-center', 'account-download-button');
        downloadButton.onclick = this.addDownloadListener(accountImageWrapper);
        accountImageWrapper.appendChild(downloadButton);

        const downloadImage: HTMLImageElement = document.createElement('img');
        downloadImage.src = browser.runtime.getURL('icons/download_white.png');
        downloadButton.appendChild(downloadImage);
    }

    /**
     * Issue the download
     * @param accountElement The element with the account image in it
     */
    public addDownloadListener(accountElement: HTMLElement): (e: MouseEvent) => void {
        return async (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const image = accountElement.querySelector('img') as HTMLImageElement;
            const contentURL = image.src;
            await this.downloadContent(contentURL);
        };
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
        super.remove('account-download-button');
    }

    /**
     * Download the account image
     * @param resourceURL The url of the account image
     */
    private async downloadContent(resourceURL: string): Promise<void> {
        const accountName = this.getAccountName(document.body, Variables.accountNameClass);

        const downloadMessage: DownloadMessage = {
            imageURL: [resourceURL],
            accountName,
            type: DownloadType.single,
        };
        await browser.runtime.sendMessage(downloadMessage);
    }

}
