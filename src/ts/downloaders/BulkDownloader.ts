/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (BulkDownloader.ts) is part of InstagramDownloader which is released under *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

class BulkDownloader extends Downloader {
    private modal: Modal;
    private continueImageLoading: boolean;

    private contentList: string[] = [];
    private resolvedContent: number = 0;

    /**
     * Insert a node after another
     * @param newNode The new node which should be added
     * @param referenceNode The node after which the new node should be appended
     */
    private static insertAfter(newNode: HTMLElement, referenceNode: HTMLElement): void {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    /**
     * Create the download button on the page
     */
    createDownloadButton(): void {

        let classes: string = Variables.downloadAllSpanClass;
        let rootButton: HTMLElement = document.getElementsByClassName(classes)[0] as HTMLElement;

        if (typeof rootButton === "undefined") {
            classes = Variables.downloadAllUnsignedSpanClass;
            rootButton = document.getElementsByClassName(classes)[0] as HTMLElement;
            if (typeof rootButton === "undefined") {
                return;
            }
        }

        const downloadSpan: HTMLElement = document.createElement("span");
        downloadSpan.setAttribute("class", `${classes} download-all-button`);
        downloadSpan.onclick = this.prepareDownload.bind(this);
        BulkDownloader.insertAfter(downloadSpan, rootButton);

        const downloadButton: HTMLElement = document.createElement("button");
        downloadButton.setAttribute("class", Variables.followButtonClass);
        downloadButton.innerText = "Download All";
        downloadSpan.appendChild(downloadButton);

    }

    /**
     * Prepare and execute the download
     */
    async prepareDownload(): Promise<void> {

        this.continueImageLoading = true;
        this.contentList = [];
        this.resolvedContent = 0;

        // Display the modal
        this.displayInfoModal();

        // Get all image links
        const postLinkSet: Set<string> = await this.collectImageLinks();

        this.modal.removeFromPage();

        const modal = this.displayCollectImagesModal();

        // Collect the content links
        this.collectDownloadLinks(postLinkSet);

        // Wait until the download is complete
        await this.waitUntilDownloadComplete(postLinkSet.size);

        // Download the content in the background
        this.downloadContent(this.contentList);

        modal.removeFromPage();

        await sleep(200);

        this.displayEndModal();

        // Clear the list
        this.contentList = [];
        this.resolvedContent = 0;

        this.continueImageLoading = true;
    }

    /**
     * Display the info modal
     */
    displayInfoModal(): void {
        const header = "Download Options";
        const textList =
            ["You can stop the download by clicking the stop button.",
                "If you stop the download, all the images already captured will be downloaded.",
                "If you try to download more than 1000 pictures at once Instagram may block your IP for about five minutes.",
                "", "",
            ];

        // @ts-ignore
        const imageURL = browser.runtime.getURL("icons/instagram.png");

        const buttonList: ModalButton[] = [{
            text: "Stop Download",
            active: true,
            callback: this.stopDownload.bind(this),
        }];

        this.modal = new Modal(header, textList, buttonList, imageURL);
        this.modal.showModal();
    }

    /**
     * Display the end of download modal
     */
    displayEndModal(): void {
        const button: ModalButton[] = [{
            active: true,
            text: "Close",
            callback: removeEndModal.bind(this),
        }];


        // @ts-ignore
        const imageURL = browser.runtime.getURL("icons/instagram.png");
        const modal: Modal = new Modal("Post collection complete",
            ["You can continue browsing.", "The download will proceed in the background."],
            button, imageURL);
        modal.showModal();

        function removeEndModal(): void {
            modal.removeFromPage();
        }
    }

    /**
     * Collect all images of an account by scrolling down
     */
    async collectImageLinks(): Promise<Set<string>> {

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
            const progressText = document.querySelector(".modal-content").querySelectorAll<HTMLParagraphElement>(".modal-text")[4];
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
    collectPostLinks(postLinkSet: Set<string>): void {
        // Get all images which are displayed
        const images = Array.from(document.getElementsByClassName(Variables.hoverImageClass));
        images.forEach((imageElement: HTMLElement) => {
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
    collectDownloadLinks(postLinkSet: Set<string>): void {
        postLinkSet.forEach((link: string) => {
            const xHttp: XMLHttpRequest = new XMLHttpRequest();
            xHttp.onreadystatechange = () => {
                if (xHttp.readyState === XMLHttpRequest.DONE && xHttp.status === 200) {
                    this.contentList.push(...this.extractLinks(JSON.parse(xHttp.response).graphql.shortcode_media));
                    ++this.resolvedContent;
                } else if (xHttp.readyState === XMLHttpRequest.DONE) {
                    ++this.resolvedContent;
                }
            };
            xHttp.open("GET", `${link}?__a=1`, true);
            xHttp.send();
        });
    }

    /**
     * Pause the download until all images are resolved
     * @param postNumber The number of posts
     */
    async waitUntilDownloadComplete(postNumber: number): Promise<void> {
        while (this.resolvedContent < postNumber) {
            const progressText: HTMLParagraphElement = document.querySelector(".modal-content")
                .querySelectorAll(".modal-text")[1] as HTMLParagraphElement;
            progressText.innerText = `Collected ${this.resolvedContent} of ${postNumber} Posts.`;
            await sleep(200);
        }
    }

    /**
     * Reinitialize the downloader
     */
    reinitialize(): void {
        this.remove();
        this.init();
    }

    /**
     * Remove the downloader from the page
     */
    remove(): void {
        super.remove("download-all-button");
    }

    /**
     * Stop the download
     */
    private stopDownload(): void {
        this.continueImageLoading = false;
    }

    /**
     * Display the collect image modal
     */
    private displayCollectImagesModal(): Modal {
        // @ts-ignore
        const imageURL = browser.runtime.getURL("icons/instagram.png");
        const button: ModalButton = {
            active: true,
            callback: () => this.resolvedContent = Number.MAX_VALUE,
            text: "Stop collecting images and start the download",
        };
        const modal = new Modal("Please wait", ["Please wait until the download continues in the background", ""], [button], imageURL);
        modal.showModal();
        return modal;
    }

    /**
     * Extract the links form the instagram api response and return the links as list
     * @param response The instagram api response
     * @returns The image and video links in a list
     */
    private extractLinks(response: ShortcodeMedia): string[] {
        if (response.__typename === "GraphVideo") {
            return [response.video_url];
        } else if (response.__typename === "GraphSidecar") {
            const contentList: string[] = [];

            response.edge_sidecar_to_children.edges.forEach((image: Edge) => {
                if (image.node.__typename === "GraphVideo") {
                    contentList.push(image.node.video_url);
                } else {
                    contentList.push(image.node.display_url);
                }
            });
            return contentList;
        } else {
            return [response.display_url];
        }
    }

    /**
     * Download the actual content
     * @param resourceURLList A list of content urls
     */
    private downloadContent(resourceURLList: string[]): void {
        const downloadMessage: BulkDownloadMessage = {
            imageURL: resourceURLList,
            accountName: this.getAccountName(document.body, Variables.accountNameClass),
            type: ContentType.bulk,
        };
        // @ts-ignore
        browser.runtime.sendMessage(downloadMessage);
    }


}
