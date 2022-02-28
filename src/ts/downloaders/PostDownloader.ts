/****************************************************************************************
 * Copyright (c) 2021. HuiiBuh                                                          *
 * This file (PostDownloader.ts) is part of InstagramDownloader which is released under *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import { browser } from 'webextension-polyfill-ts';
import { LogClassErrors } from '../decorators';
import { log } from '../functions';
import { DownloadMessage, DownloadType } from '../modles/extension';
import { QuerySelectors } from '../QuerySelectors';
import { getMedia, getSliderIndex } from './download-functions';
import { Downloader } from './Downloader';

/**
 * A downloader which can be used for instagram posts
 */
@LogClassErrors
export class PostDownloader extends Downloader {

    private creationTimeoutList: number[] = [];

    /**
     * Issue a download
     * @param element The element of the main post
     */
    private static async downloadContent(element: HTMLElement): Promise<void> {
        const link = (element.querySelector(QuerySelectors.postLink) as HTMLAnchorElement).href;
        const index = getSliderIndex(element);
        log(['Image index: ', index]);

        const response = await getMedia(link, index);
        log(['Extracted image: ', response]);

        const downloadMessage: DownloadMessage = {
            imageURL: response.mediaURL,
            accountName: response.accountName,
            type: DownloadType.single,
        };
        await browser.runtime.sendMessage(downloadMessage);
    }

    /**
     * Create a new download button
     */
    public async createDownloadButton(): Promise<void> {
        let postList: HTMLElement[] = [...document.querySelectorAll(QuerySelectors.postWrapper)] as HTMLElement[];

        // Sometimes the button gets added at the moment the image gets updated
        // If this is the case the image download button cannot be added, so here is a timeout to try it again
        if (postList.length === 0) {
            postList = await this.retryCreateButton();
        }
        this.creationTimeoutList.forEach(t => clearTimeout(t));
        this.creationTimeoutList = [];

        postList.forEach((element: HTMLElement) => {
            this.addDownloadButton(element);
        });
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
        super.remove('.post-download-button');
    }

    private async retryCreateButton(maxRetries: number = 20, retries: number = 0): Promise<HTMLElement[]> {
        await new Promise(resolve => {
            this.creationTimeoutList.push(setTimeout(resolve, 100) as unknown as number);
        });
        let postList = [...document.querySelectorAll(QuerySelectors.postWrapper)] as HTMLElement[];
        log(['with timeout', postList]);

        if (postList.length === 0 || maxRetries <= retries) {
            postList = await this.retryCreateButton(maxRetries, retries + 1);
        }

        return postList;
    }

    /**
     * Add the download button to the posts on the page
     * @param element The Post the download button should be added to
     */
    private addDownloadButton(element: HTMLElement): void {

        // Only first post
        const bookmarkElement: HTMLElement = element.querySelector(QuerySelectors.postBookmark) as HTMLElement;
        const downloadButton: HTMLElement = document.createElement('span');
        downloadButton.classList.add('post-download-button');
        bookmarkElement.appendChild(downloadButton);

        downloadButton.onclick = () => PostDownloader.downloadContent(element);
    }
}
