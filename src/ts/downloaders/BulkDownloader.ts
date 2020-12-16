/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (BulkDownloader.ts) is part of InstagramDownloader which is released under *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/
import {browser} from 'webextension-polyfill-ts';
import {insertAfter, sleep, validURL} from '../functions';
import {Modal, ModalButton} from '../Modal';
import {Edge, ShortcodeMedia} from '../modles/instagram';
import {BulkDownloadMessage, DownloadType} from '../modles/messages';
import {Variables} from '../Variables';
import {Downloader} from './Downloader';

export class BulkDownloader extends Downloader {

    private modal: Modal;
    private continueImageLoading: boolean = true;

    private contentList: string[] = [];
    private resolvedContent: number = 0;

    public constructor() {
        super();
        this.modal = this.createModal();
    }

    /**
     * Create the download button on the page
     */
    public createDownloadButton(): void {
        let rootButton: HTMLElement | null = null;
        let classes: string = '';

        for (classes of Variables.downloadAllInsertClassList) {
            rootButton = document.getElementsByClassName(classes)[0] as HTMLElement;
            if (rootButton) break;
        }
        if (!rootButton) return;

        const downloadSpan: HTMLElement = document.createElement('span');
        downloadSpan.setAttribute('class', `${classes} download-all-button`);
        downloadSpan.onclick = this.prepareDownload.bind(this);
        insertAfter(downloadSpan, rootButton);

        const downloadButton: HTMLElement = document.createElement('button');
        downloadButton.setAttribute('class', Variables.followButtonClass);
        downloadButton.innerText = 'Download All';
        downloadSpan.appendChild(downloadButton);

    }

    /**
     * Prepare and execute the download
     */
    public async prepareDownload(): Promise<void> {
        this.continueImageLoading = true;
        this.contentList = [];
        this.resolvedContent = 0;

        // Display the modal
        this.modal.showModal();

        // Get all image links
        const postLinkSet: Set<string> = await this.collectImageLinks();

        this.modal.removeFromPage();

        const modal = this.displayCollectImagesModal();

        // Collect the content links
        this.collectDownloadLinks(postLinkSet);

        // Wait until the download is complete
        await this.waitUntilLinkCollectionCompletes(postLinkSet.size);

        // Download the content in the background
        await this.downloadContent(this.contentList);

        modal.removeFromPage();

        await sleep(200);

        this.displayEndModal();

        // Clear the list
        this.contentList = [];
        this.resolvedContent = 0;

        this.continueImageLoading = true;
    }

    /**
     * Display the end of download modal
     */
    public displayEndModal(): void {
        const button: ModalButton[] = [{
            active: true,
            text: 'Close',
            callback: removeEndModal.bind(this),
        }];

        const imageURL = browser.runtime.getURL('icons/instagram.png');
        const modal: Modal = new Modal('Post collection complete',
            ['You can continue browsing.', 'The download will proceed in the background.'],
            button, imageURL);
        modal.showModal();

        function removeEndModal(): void {
            modal.removeFromPage();
        }
    }

    /**
     * Collect all images of an account by scrolling down
     */
    public async collectImageLinks(): Promise<Set<string>> {

        // Create a new set
        const postLinkSet: Set<string> = new Set<string>();

        let loadingIndicator: boolean;
        let interruptClass: boolean;

        // Scroll to top
        window.scrollTo(0, 0);

        // Scroll down and collect images as long as possible
        do {
            this.collectPostLinks(postLinkSet);

            // Scroll down
            scrollBy(0, document.body.clientHeight);
            await sleep(100);

            // Show the collected image number
            const progressText = document.querySelector('.modal-content')!.querySelectorAll<HTMLParagraphElement>('.modal-text')[4];
            progressText.innerText = `Collected ${postLinkSet.size} Posts.`;

            // Check for classes which indicate the end of the image loading
            loadingIndicator = document.getElementsByClassName(Variables.loadingButtonClass).length > 0;
            interruptClass = document.getElementsByClassName(Variables.stopDownloadClass).length === 0;
        } while (this.continueImageLoading && loadingIndicator && interruptClass);

        this.collectPostLinks(postLinkSet);

        return postLinkSet;
    }

    /**
     * Collect the links from the posts
     * @param postLinkSet A set of post links
     */
    public collectPostLinks(postLinkSet: Set<string>): void {
        // Get all images which are displayed
        const images = [...document.getElementsByClassName(Variables.imagePreview)] as HTMLElement[];
        images.forEach((imageElement) => {
            // Add the image links to the images
            const imageLinkElement: HTMLAnchorElement = imageElement.firstChild as HTMLAnchorElement;
            if (imageLinkElement?.href && validURL(imageLinkElement.href)) {
                postLinkSet.add(imageLinkElement.href);
            }
        });
    }

    /**
     * Mak api calls to get the images
     * @param postLinkSet All the image links on the page
     */
    public collectDownloadLinks(postLinkSet: Set<string>): void {
        postLinkSet.forEach((link: string) => {
            const xHttp: XMLHttpRequest = new XMLHttpRequest();
            xHttp.onreadystatechange = () => {
                if (xHttp.readyState === XMLHttpRequest.DONE && xHttp.status === 200) {
                    this.contentList.push(...this.extractLinks(JSON.parse(xHttp.response).graphql.shortcode_media));
                    this.resolvedContent += 1;
                } else if (xHttp.readyState === XMLHttpRequest.DONE) {
                    this.resolvedContent += 1;
                }
            };
            xHttp.open('GET', `${link}?__a=1`, true);
            xHttp.send();
        });
    }

    /**
     * Remove the downloader from the page
     */
    public remove(): void {
        super.remove('download-all-button');
    }

    /**
     * Reinitialize the downloader
     */
    public reinitialize(): void {
        console.log("re-bulk");
        this.remove();
        this.init();
    }

    private createModal(): Modal {
        const header = 'Download Options';
        const textList =
            ['You can stop the download by clicking the stop button.',
                'If you stop the download, all the images already captured will be downloaded.',
                'If you try to download more than 1000 pictures at once Instagram may block your IP for about five minutes.',
                '', '',
            ];

        const imageURL = browser.runtime.getURL('icons/instagram.png');

        const buttonList: ModalButton[] = [{
            text: 'Stop Download',
            active: true,
            callback: this.stopImageCollection.bind(this),
        }];

        return new Modal(header, textList, buttonList, imageURL);
    }

    /**
     * Pause the download until all images are resolved
     * @param postNumber The number of posts
     */
    private async waitUntilLinkCollectionCompletes(postNumber: number): Promise<void> {
        while (this.resolvedContent < postNumber) {
            const progressText: HTMLParagraphElement = document.querySelector('.modal-content')!
                .querySelectorAll('.modal-text')[1] as HTMLParagraphElement;
            progressText.innerText = `Collected ${this.resolvedContent} of ${postNumber} Posts.`;
            await sleep(200);
        }
    }

    /**
     * Stop the image collection
     */
    private stopImageCollection(): void {
        this.continueImageLoading = false;
    }

    /**
     * Display the collect image modal
     */
    private displayCollectImagesModal(): Modal {
        const imageURL = browser.runtime.getURL('icons/instagram.png');
        const button: ModalButton = {
            active: true,
            callback: () => this.resolvedContent = Number.MAX_VALUE,
            text: 'Stop collecting images and start the download',
        };
        const modal = new Modal('Please wait', ['Please wait until the download continues in the background', ''], [button], imageURL);
        modal.showModal();

        return modal;
    }

    /**
     * Extract the links form the instagram api response and return the links as list
     * @param response The instagram api response
     * @returns The image and video links in a list
     */
    private extractLinks(response: ShortcodeMedia): string[] {
        if (response.__typename === 'GraphVideo') {
            return [response.video_url];
        }
        if (response.__typename === 'GraphSidecar') {
            const contentList: string[] = [];

            response.edge_sidecar_to_children.edges.forEach((image: Edge) => {
                if (image.node.__typename === 'GraphVideo') {
                    contentList.push(image.node.video_url);
                } else {
                    contentList.push(image.node.display_url);
                }
            });

            return contentList;
        }

        return [response.display_url];
    }

    /**
     * Download the actual content
     * @param resourceURLList A list of content urls
     */
    private async downloadContent(resourceURLList: string[]): Promise<void> {
        const downloadMessage: BulkDownloadMessage = {
            imageURL: resourceURLList,
            accountName: this.getAccountName(document.body, Variables.accountNameClass),
            type: DownloadType.bulk,
        };
        await browser.runtime.sendMessage(downloadMessage);
    }

}
