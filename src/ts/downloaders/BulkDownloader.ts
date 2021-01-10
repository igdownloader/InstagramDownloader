/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (BulkDownloader.ts) is part of InstagramDownloader which is released under *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/
import { browser } from 'webextension-polyfill-ts';
import { log, sleep, validURL } from '../functions';
import { Modal } from '../helper-classes/Modal';
import { DownloadMessage, DownloadType } from '../modles/extension';
import { Variables } from '../Variables';
import { atBottom, getMedia } from './download-functions';
import { Downloader } from './Downloader';

export class BulkDownloader extends Downloader {

    private modal: Modal = new Modal({imageURL: browser.runtime.getURL('icons/instagram.png')});
    private continueImageLoading: boolean = true;

    private readonly downloadIndicator: HTMLParagraphElement;
    private resolvedContent: number = 0;

    public constructor() {
        super();
        this.downloadIndicator = document.createElement('p');
        this.downloadIndicator.id = 'download-indicator';
        this.downloadIndicator.classList.add('modal-text');
    }

    /**
     * Create the download button on the page
     */
    public createDownloadButton(): void {
        const downloadButton: HTMLElement = document.createElement('button');
        downloadButton.innerText = 'Download All';
        downloadButton.classList.add('large-button', 'top', 'right');
        downloadButton.onclick = this.prepareDownload.bind(this);
        document.body.appendChild(downloadButton);
    }

    /**
     * Remove the downloader from the page
     */
    public remove(): void {
        super.remove('large-button top right');
    }

    /**
     * Reinitialize the downloader
     */
    public reinitialize(): void {
        this.remove();
        this.init();
    }

    /**
     * Prepare and execute the download
     */
    private async prepareDownload(): Promise<void> {
        const downloadSpeed = await this.getDownloadSpeed();
        if (!downloadSpeed) return;

        // Get all links of content posts
        const postLinks: Set<string> = await this.collectImageLinks(downloadSpeed);

        // Collect the media files of the posts
        const mediaLinks: string[] = await this.collectMedia(postLinks);

        // Download the content in the background
        const downloadMessage: DownloadMessage = {
            imageURL: mediaLinks,
            accountName: this.getAccountName(document.body, Variables.accountNameClass),
            timestamp: [0],
            type: DownloadType.bulk,
        };
        await browser.runtime.sendMessage(downloadMessage);

        this.displayEndModal();
    }

    private getDownloadSpeed(): Promise<number | null> {

        return new Promise((resolve) => {
            this.modal.heading = 'Select the download speed';

            this.modal.buttonList = [{
                text: 'Close',
                callback: () => {
                    resolve(null);
                    this.modal.close();
                },
            }, {
                text: 'Continue',
                active: true,
                callback: () => {
                    const value = (this.modal.element?.querySelector('#download-speed') as HTMLSelectElement).value;
                    resolve(parseInt(value, 0) % 10);
                },
            }];

            const downloadSpeedLabel = document.createElement('label');
            downloadSpeedLabel.innerText = 'Download speed';
            downloadSpeedLabel.classList.add('modal-input');

            const select = document.createElement('select');
            select.name = 'Download Speed';
            select.id = 'download-speed';
            select.setAttribute('value', '5');

            for (const i of new Array(9).keys()) {
                const option = document.createElement('option');
                option.value = (i + 1).toString();
                option.innerText = (i + 1).toString();
                if (i === 4) option.setAttribute('selected', '');
                select.appendChild(option);
            }

            downloadSpeedLabel.appendChild(select);

            this.modal.content = ['', downloadSpeedLabel];
            this.modal.open();
        });

    }

    /**
     * Collect all images of an account by scrolling down
     */
    private async collectImageLinks(downloadSpeed: number): Promise<Set<string>> {

        // Show the modal which allows the user to stop the collection process
        this.showStopCollectingModal();

        // Create a new set
        const postLinkSet: Set<string> = new Set<string>();
        this.continueImageLoading = true;

        let loadingIndicator: boolean;
        let interruptClass: boolean;

        log('Start collecting download links');
        // Scroll down and collect images as long as possible
        do {
            this.collectPostLinks(postLinkSet);

            // Scroll down
            scrollBy(0, window.innerHeight);
            await sleep(downloadSpeed * 100);

            // Show the collected image number
            this.downloadIndicator.innerText = `Collected ${postLinkSet.size} Posts.`;

            // Check for classes which indicate the end of the image loading
            loadingIndicator = document.getElementsByClassName(Variables.loadingButtonClass).length > 0;
            interruptClass = document.getElementsByClassName(Variables.stopDownloadClass).length === 0;
        } while (this.continueImageLoading && loadingIndicator && interruptClass || !atBottom() && this.continueImageLoading);

        this.collectPostLinks(postLinkSet);

        log(['Collected bulk links:', postLinkSet]);

        return postLinkSet;
    }

    private showStopCollectingModal(): void {
        this.modal.heading = 'Start Download';

        this.modal.content =
            [
                'You can stop the download by clicking the stop button. If you stop the download, all the images already captured will be downloaded.',
                'If you try to download more than 1000 pictures at once Instagram may block your IP for about five minutes.',
                '', this.downloadIndicator,
            ];

        this.modal.buttonList = [{
            text: 'Stop Download',
            active: true,
            callback: () => {
                log(['Stop download']);
                this.continueImageLoading = false;
            },
        }];

        this.modal.open();
    }

    /**
     * Collect the links from the posts
     * @param postLinkSet A set of post links
     */
    private collectPostLinks(postLinkSet: Set<string>): void {
        // Get all images which are displayed
        const images = [...document.querySelectorAll(Variables.imagePreview)] as HTMLElement[];
        images.forEach((imageElement) => {
            // Add the image links to the images

            // @ts-ignore
            const downloadLink = 'href' in imageElement ? imageElement.href : imageElement.firstChild?.href;
            if (validURL(downloadLink)) {
                postLinkSet.add(downloadLink);
            }
        });
    }

    /**
     * Display the collect image modal
     */
    private async collectMedia(postLinks: Set<string>): Promise<string[]> {
        this.modal.heading = 'Please Wait';
        this.modal.content = ['Please wait until the download continues in the background', '', this.downloadIndicator];
        this.modal.buttonList = [{
            active: true,
            callback: () => this.resolvedContent = Number.MAX_VALUE,
            text: 'Stop collecting images and start the download',
        }];
        await this.modal.open();

        // Collect the content links
        return this.collectDownloadLinks(postLinks);
    }

    /**
     * Mak api calls to get the images
     * @param postLinks All the image links on the page
     */
    private collectDownloadLinks(postLinks: Set<string>): Promise<string[]> {
        this.resolvedContent = 0;

        return new Promise<string[]>(resolve => {
            const mediaList: string[] = [];
            for (const link of postLinks) {
                getMedia(link)
                    .then(response => {
                        mediaList.push(...response.mediaURL);
                    })
                    .finally(() => {
                        this.resolvedContent += 1;
                        this.downloadIndicator.innerText = `Collected ${this.resolvedContent} of ${postLinks.size} Posts.`;
                        if (this.resolvedContent >= postLinks.size) {
                            resolve(mediaList);
                        }
                    });
            }
        });
    }

    /**
     * Display the end of download modal
     */
    private displayEndModal(): void {
        this.modal.heading = 'Media collection complete';
        this.modal.buttonList = [{text: 'Close', active: true}];
        this.modal.content = ['You can continue browsing.', 'The download will proceed in the background.'];
        this.modal.open();
    }

}
