/****************************************************************************************
 * Copyright (c) 2022. HuiiBuh                                                          *
 * This file (StoryDownloader.ts) is part of InstagramDownloader which is not released  *
 * under any licence.                                                                   *
 * Any usage of this code outside this project is not allowed.                          *
 ****************************************************************************************/

import * as browser from 'webextension-polyfill';
import { LogClassErrors } from '../decorators';
import { log } from '../functions';
import { DownloadMessage, DownloadType } from '../models/extension';
import { QuerySelectors } from '../QuerySelectors';
import { extractSrcSet } from './download-functions';
import { Downloader } from './Downloader';

/**
 * Download class which can be used to download stories
 */
@LogClassErrors
export class StoryDownloader extends Downloader {

    /**
     * Download the correct content
     */
    public static async downloadContent(event: MouseEvent | KeyboardEvent): Promise<void> {
        event.stopPropagation();
        event.preventDefault();

        const video = document.querySelector('video');
        const img = document.querySelector(QuerySelectors.storyImage) as HTMLImageElement | null;

        log(video);
        log(img);

        let url: string = '';
        if (video) {
            url = video.currentSrc;
        } else if (img) {
            url = extractSrcSet(img);
        }

        const storyAccountName = (document.querySelector(QuerySelectors.storyAccountName) as HTMLElement | null)?.innerText || 'unknown';

        const downloadMessage: DownloadMessage = {
            imageURL: [url],
            accountName: storyAccountName,
            type: DownloadType.single,
        };
        await browser.runtime.sendMessage(downloadMessage);
    }

    /**
     * Create a new download button
     */
    public createDownloadButton(): void {
        const closeButton = document.querySelector(QuerySelectors.storyCloseButton)?.parentElement as HTMLElement | null;

        // Check if the story has already loaded
        if (!closeButton) {
            log('Could not find story close button');
            return;
        }

        const downloadButton = document.createElement('span') as HTMLElement;
        downloadButton.classList.add('story-download-button');

        downloadButton.onclick = StoryDownloader.downloadContent;

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
        super.remove('.story-download-button');
    }
}
