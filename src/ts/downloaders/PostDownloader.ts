/****************************************************************************************
 * Copyright (c) 2022. HuiiBuh                                                          *
 * This file (PostDownloader.ts) is part of InstagramDownloader which is not released   *
 * under any licence.                                                                   *
 * Any usage of this code outside this project is not allowed.                          *
 ****************************************************************************************/

import { browser } from 'webextension-polyfill-ts';
import { Alert } from '../components/Alert';
import { LogClassErrors } from '../decorators';
import { log } from '../functions';
import { DownloadMessage, DownloadType, LoggingLevel } from '../modles/extension';
import { QuerySelectors } from '../QuerySelectors';
import { extractSrcSet, getSliderIndex } from './download-functions';
import { Downloader } from './Downloader';

function getSliderElementFromPosition({index, isLast}: { index: number; isLast: boolean }, sliderItems: HTMLElement[]): HTMLElement {
    // First or second. In this case only 3 slider for the second and 2 for the first items are visible
    if (index === 0 || index === 1) {
        return sliderItems[index];
    }

    // Return last for last element
    if (isLast) {
        return sliderItems[sliderItems.length - 1];
    }

    // Last. In this case only 3 slider items are visible
    if (sliderItems.length === 3) {
        return sliderItems[1];
    }

    // For everything else it is the 2 element
    return sliderItems[1];

    // 2 5
}

/**
 * A downloader which can be used for instagram posts
 */
@LogClassErrors
export class PostDownloader extends Downloader {

    private creationTimeoutList: number[] = [];
    private removed = true;

    /**
     * Issue a download
     * @param element The element of the main post
     */
    public static async downloadContent(element: HTMLElement): Promise<void> {
        const isSlider = element.querySelector(QuerySelectors.sliderItem);
        if (isSlider) {
            await PostDownloader.downloadWithSlider(element);
        } else {
            await PostDownloader.downloadWithOutSlider(element);
        }
    }

    private static async downloadWithSlider(element: HTMLElement): Promise<void> {
        const index = getSliderIndex(element);
        if (index.index === -1) {
            Alert.createAndAdd('Could not find slider index', 'warn');
            return;
        }
        const sliderItems = [...element.querySelectorAll(QuerySelectors.sliderItem)] as HTMLElement[];
        const sliderElement = getSliderElementFromPosition(index, sliderItems);
        log(['Image index: ', index, sliderElement]);
        if (!sliderElement) {
            log('Could not find slider element', LoggingLevel.warn);
            return;
        }

        const img = sliderElement.querySelector('img');
        const video = sliderElement.querySelector('video');

        await PostDownloader.download(img, video, element);
    }

    private static async download(img: HTMLImageElement | null | undefined, video: HTMLVideoElement | undefined | null, element: HTMLElement): Promise<void> {
        let dlLink: string;
        if (img) {
            dlLink = extractSrcSet(img);
        } else {
            const currentSrc = video?.currentSrc;
            if (!currentSrc) {
                Alert.createAndAdd('Could not find post', 'warn');
                return;
            }
            if (currentSrc?.startsWith?.('blob:')) {
                Alert.createAndAdd('Videos cannot be downloaded, because IG started blocking it.', 'warn');
                return;
            }
            dlLink = currentSrc;
        }

        const postAccountName = (element.querySelector(QuerySelectors.postAccountName) as HTMLElement | null)?.innerText || 'unknown';

        const downloadMessage: DownloadMessage = {
            imageURL: [dlLink]!,
            accountName: postAccountName,
            type: DownloadType.single,
        };
        await browser.runtime.sendMessage(downloadMessage);
    }

    private static async downloadWithOutSlider(element: HTMLElement): Promise<void> {
        const postContentWrapper = element.querySelector(QuerySelectors.postContentWrapper)
            || document.querySelector(QuerySelectors.postContentWrapper);
        const img = postContentWrapper?.querySelector?.('img');
        const video = postContentWrapper?.querySelector?.('video');

        await PostDownloader.download(img, video, element);
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

    public init(): void {
        this.removed = false;
        super.init();
    }

    /**
     * Remove the downloader
     */
    public remove(): void {
        this.removed = true;
        super.remove('.post-download-button');
    }

    private async retryCreateButton(maxRetries: number = 20, retries: number = 0): Promise<HTMLElement[]> {
        await new Promise(resolve => {
            this.creationTimeoutList.push(setTimeout(resolve, 100) as unknown as number);
        });
        let postList = [...document.querySelectorAll(QuerySelectors.postWrapper)] as HTMLElement[];
        log(['with timeout', postList]);

        if (postList.length === 0 || maxRetries <= retries) {
            if (!this.removed) {
                postList = await this.retryCreateButton(maxRetries, retries + 1);
            }
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
        downloadButton.onclick = () => PostDownloader.downloadContent(element);
        bookmarkElement?.appendChild(downloadButton);
    }
}
