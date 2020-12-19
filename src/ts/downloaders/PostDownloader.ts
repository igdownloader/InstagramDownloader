/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (PostDownloader.ts) is part of InstagramDownloader which is released under *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import { browser } from 'webextension-polyfill-ts';
import { log } from '../functions';
import { DownloadMessage, DownloadType } from '../modles/messages';
import { Variables } from '../Variables';
import { getMedia, getSliderIndex } from './download-functions';
import { Downloader } from './Downloader';

/**
 * A downloader which can be used for instagram posts
 */
export class PostDownloader extends Downloader {

    /**
     * Issue a download
     * @param element The element of the main post
     */
    private static async downloadContent(element: HTMLElement): Promise<void> {
        const link = (element.querySelector(Variables.postLinkSelector) as HTMLAnchorElement).href;
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
    public createDownloadButton(): void {
        const postList: HTMLElement[] = Array.from(document.getElementsByClassName(Variables.postWrapperClass)) as HTMLElement[];
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
        super.remove('post-download-button');
    }

    /**
     * Add the download button to the posts on the page
     * @param element The Post the download button should be added to
     */
    private addDownloadButton(element: HTMLElement): void {
        const bookmarkElement: HTMLElement = element.getElementsByClassName(Variables.postBookmarkClass)[0] as HTMLElement;
        const downloadButton: HTMLElement = document.createElement('span');
        downloadButton.classList.add('post-download-button');
        bookmarkElement.appendChild(downloadButton);

        downloadButton.onclick = PostDownloader.downloadContent.bind(this, element);
    }
}
