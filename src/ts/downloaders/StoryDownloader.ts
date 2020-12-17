/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (StoryDownloader.ts) is part of InstagramDownloader which is released under*
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import { browser } from 'webextension-polyfill-ts';
import { DownloadMessage, DownloadType } from '../modles/messages';
import { Variables } from '../Variables';
import { Downloader } from './Downloader';

/**
 * Download class which can be used to download stories
 */
export class StoryDownloader extends Downloader {

    /**
     * Create a new download button
     */
    public createDownloadButton(): void {
        const closeButton: HTMLElement = document.querySelector(Variables.storyCloseButton) as HTMLElement;

        // Check if the story has already loaded
        if (!closeButton) return;

        const downloadButton: HTMLElement = document.createElement('span');
        downloadButton.classList.add('story-download-button');

        const accountName: string = this.getAccountName(document.body, Variables.storyAccountName);
        downloadButton.onclick = this.downloadContent(accountName);

        closeButton.appendChild(downloadButton);
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
        super.remove('story-download-button');
    }

    /**
     * Download the correct content
     * @param accountName The name of the account
     */
    private downloadContent(accountName: string): (event: MouseEvent) => void {
        return async (event: MouseEvent): Promise<void> => {
            event.stopPropagation();
            event.preventDefault();

            const video = document.querySelector('video') as HTMLVideoElement;
            const img = document.querySelector(Variables.storyImageClass) as HTMLImageElement;

            console.log(video);
            console.log(img);

            let url: string = '';
            if (video) {
                url = video.currentSrc;
            } else if (img) {
                url = img.src;
            }

            const downloadMessage: DownloadMessage = {
                imageURL: [url],
                accountName,
                type: DownloadType.single,
            };
            await browser.runtime.sendMessage(downloadMessage);
        };
    }
}
