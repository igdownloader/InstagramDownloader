/****************************************************************************************
 * Copyright (c) 2022. HuiiBuh                                                          *
 * This file (HoverDownloader.ts) is part of InstagramDownloader which is not released  *
 * under any licence.                                                                   *
 * Any usage of this code outside this project is not allowed.                          *
 ****************************************************************************************/

import { browser } from 'webextension-polyfill-ts';
import { Modal } from '../components/Modal';
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

            const response = await getMedia(link);

            const downloadAll = async () => {
                const downloadMessage: DownloadMessage = {
                    imageURL: response.mediaURL,
                    accountName: response.accountName,
                    type: DownloadType.bulk,
                };
                await browser.runtime.sendMessage(downloadMessage);
            };

            const downloadOne = async () => {
                const downloadMessage: DownloadMessage = {
                    imageURL: [response.mediaURL[0]],
                    accountName: response.accountName,
                    type: DownloadType.single,
                };
                await browser.runtime.sendMessage(downloadMessage);
            };

            if (response.mediaURL.length > 1) {
                const modal = new Modal({
                    imageURL: browser.runtime.getURL('icons/instagram.png'),
                    heading: 'Do you want to download all the images in the post',
                    buttonList: [{
                        text: 'Yes',
                        callback: () => {
                            modal.close();
                            downloadAll();
                        },
                    }, {
                        text: 'No',
                        callback: () => {
                            modal.close();
                            downloadOne();
                        },
                    }],
                });
                modal.open();
            } else {
                downloadOne();
            }

        };
    }

}
