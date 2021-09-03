/****************************************************************************************
 * Copyright (c) 2021. HuiiBuh                                                          *
 * This file (HoverDownloader.ts) is part of InstagramDownloader which is released under*
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import { browser } from 'webextension-polyfill-ts';
import { LogClassErrors } from '../decorators';
import { DownloadMessage, DownloadType } from '../modles/extension';
import { QuerySelectors } from '../QuerySelectors';
import { getMedia } from './download-functions';
import { Downloader } from './Downloader';

/**
 * A downloader which can be used to hover over images and download them
 */
@LogClassErrors
export class HoverDownloader extends Downloader {

    private static getLink(element: HTMLElement): string | null {
        if ('href' in element) {
            return (element as HTMLAnchorElement).href;
        }

        const a = element.querySelector('a');
        if (a && 'href' in a) {
            return a.href;
        }

        return null;
    }

    /**
     * Create download button for every image
     */
    public createDownloadButton(): void {
        const imageList: HTMLElement[] = [...document.querySelectorAll(QuerySelectors.imagePreview)] as HTMLElement[];

        imageList.forEach((imageElement: HTMLElement) => {

            const downloadLink = HoverDownloader.getLink(imageElement);
            // Instagram placeholder for images with no content
            if (!downloadLink) return;

            const downloadButton: HTMLElement = document.createElement('span');
            downloadButton.classList.add('h-v-center', 'hover-download-button');

            const downloadImage: HTMLImageElement = document.createElement('img');
            downloadImage.src = browser.runtime.getURL('icons/download_white.png');
            downloadButton.appendChild(downloadImage);

            imageElement.appendChild(downloadButton);

            downloadButton.onclick = this.addDownloadListener(downloadLink);
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
    private addDownloadListener(link: string): (event: MouseEvent) => Promise<void> {
        return async (event: MouseEvent): Promise<void> => {
            event.preventDefault();
            event.stopPropagation();

            const response = await getMedia(link, -1);

            const downloadMessage: DownloadMessage = {
                imageURL: response.mediaURL,
                accountName: response.accountName,
                type: DownloadType.single,
            };
            await browser.runtime.sendMessage(downloadMessage);
        };
    }

}
