/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (HoverDownloader.ts) is part of InstagramDownloader which is released under*
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import {browser} from 'webextension-polyfill-ts';
import {ShortcodeMedia} from '../modles/instagram';
import {ContentType, DownloadMessage} from '../modles/messages';
import {Variables} from '../Variables';
import {Downloader} from './Downloader';

/**
 * A downloader which can be used to hover over images and download them
 */
export class HoverDownloader extends Downloader {

    /**
     * Take the api response from instagram and return the content url
     * @param response The api response from instagram
     */
    private static getResourceURL(response: ShortcodeMedia): string {
        if (response.__typename === 'GraphVideo') {
            return response.video_url;
        }

        return response.display_url;
    }

    /**
     * Create download button for every image
     */
    public createDownloadButton(): void {
        const imageList: HTMLElement[] = Array.from(document.getElementsByClassName(Variables.hoverImageClass)) as HTMLElement[];

        imageList.forEach((imageElement: HTMLElement) => {
            const downloadButton: HTMLElement = document.createElement('a');
            downloadButton.setAttribute('class', `h-v-center hover-download-button`);

            const downloadLink = (imageElement as HTMLAnchorElement).href ?
                (imageElement as HTMLAnchorElement).href : (imageElement.firstChild as HTMLAnchorElement).href;

            downloadButton.onclick = this.addDownloadListener(downloadLink);
            imageElement.appendChild(downloadButton);

            const downloadImage: HTMLImageElement = document.createElement('img');
            downloadImage.src = browser.runtime.getURL('icons/download_white.png');
            downloadButton.appendChild(downloadImage);
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
     * Remove all download buttons
     */
    public remove(): void {
        super.remove('hover-download-button');
    }

    /**
     * Add a click listener to the download button
     */
    private addDownloadListener(href: string): (event: MouseEvent) => Promise<void> {
        return async (event: MouseEvent): Promise<void> => {
            event.preventDefault();
            const requestURL: string = `${href}?__a=1`;
            await this.downloadContent(requestURL);
        };
    }

    /**
     * Download the actual content
     * @param requestURL The instagram api url
     */
    private async downloadContent(requestURL: string): Promise<void> {
        const response: ShortcodeMedia = await this.makeAPIRequest(requestURL);
        const resourceURL = HoverDownloader.getResourceURL(response);

        const accountName = response?.owner?.username;

        const downloadMessage: DownloadMessage = {
            imageURL: [resourceURL],
            accountName,
            type: ContentType.single,
        };
        await browser.runtime.sendMessage(downloadMessage);
    }

    /**
     * Make a api request which returns the response to this request
     * @param requestURL The url the request should be made to
     */
    private async makeAPIRequest(requestURL: string): Promise<ShortcodeMedia> {
        return new Promise<ShortcodeMedia>(((resolve, reject) => {

            const apiRequest: XMLHttpRequest = new XMLHttpRequest();

            apiRequest.onreadystatechange = function(): void {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    const response = JSON.parse(this.responseText);
                    resolve(response.graphql.shortcode_media);
                } else if (this.readyState === XMLHttpRequest.DONE) {
                    reject(new Error('Could not connect to the instagram API.'));
                }
            };
            apiRequest.open('GET', requestURL);
            apiRequest.send();

        }));
    }

}
