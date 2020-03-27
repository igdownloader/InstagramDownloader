'use strict';

class BulkDownloader extends Downloader {
    private static modal: Modal;
    private static continueImageLoading: boolean;

    private contentList: string[] = [];
    private resolvedContent: number = 0;

    private static insertAfter(newNode: HTMLElement, referenceNode: HTMLElement): void {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    private static stopDownload(): void {
        console.log('Stopping download');
        BulkDownloader.modal.removeFromPage();
        BulkDownloader.continueImageLoading = false;
    }

    createDownloadButton(): void {

        const rootButton: HTMLElement = document.getElementsByClassName(Variables.downloadAllSpanClass)[0] as HTMLElement;

        if (rootButton === undefined) {
            return;
        }

        const downloadSpan: HTMLElement = document.createElement('span');
        downloadSpan.setAttribute('class', `${Variables.downloadAllSpanClass} download-all-button`);
        downloadSpan.onclick = this.prepareDownload(this);
        BulkDownloader.insertAfter(downloadSpan, rootButton);

        const downloadButton: HTMLElement = document.createElement('button');
        downloadButton.setAttribute('class', Variables.followButtonClass);
        downloadButton.innerText = 'Download All';
        downloadSpan.appendChild(downloadButton);

    }

    prepareDownload(self: this): () => void {
        return async () => {

            BulkDownloader.continueImageLoading = true;
            this.contentList = [];
            this.resolvedContent = 0;

            // Display the modal
            self.displayInfoModal();

            // Get all image links
            const imageLinkList: Set<string> = await self.collectImageLinks();

            // Collect the content links
            self.collectDownloadLinks(imageLinkList);

            // Download the content in the background
            self.downloadContent(self.contentList);

            // Clear the list
            self.contentList = [];
            this.resolvedContent = 0;

            BulkDownloader.continueImageLoading = true;
            BulkDownloader.modal.removeFromPage();
        };
    }

    displayInfoModal(): void {
        const header = 'Download Options';
        const textList =
            ['You can stop the download by clicking the stop button.',
                'If you stop the download, all the images already captured will be downloaded.',
                'If you try to download more than 1000 pictures at once Instagram may block your IP for about five minutes.',
            ];
        // @ts-ignore
        const imageURL = browser.runtime.getURL('icons/instagram.png');

        const buttonList: ModalButton[] = [{
            text: 'Stop Download',
            active: true,
            callback: BulkDownloader.stopDownload,
        }];

        BulkDownloader.modal = new Modal(header, textList, buttonList, imageURL);
        BulkDownloader.modal.showModal();
    }

    /**
     * Collect all images of an account by scrolling down
     */
    async collectImageLinks(): Promise<Set<string>> {

        // Create a new set
        const imageLinkSet: Set<string> = new Set<string>();

        let loadingIndicator;
        let interruptClass;

        // Scroll to top
        window.scrollTo(0, 0);


        // Scroll down and collect images as long as possible
        do {
            // Get all images which are displayed
            const images = Array.from(document.getElementsByClassName(Variables.hoverImageClass));
            images.forEach((imageElement: HTMLElement) => {
                // Add the image links to the images
                // @ts-ignore
                imageLinkSet.add(imageElement.firstChild?.href);
            });

            // Scroll down
            scrollBy(0, document.body.clientHeight);
            await sleep(100);

            // Check for classes which indicate the end of the image loading
            loadingIndicator = document.getElementsByClassName(Variables.loadingButtonClass).length > 0;
            interruptClass = document.getElementsByClassName(Variables.stopDownloadClass).length === 0;

        } while (BulkDownloader.continueImageLoading && loadingIndicator && interruptClass);

        // Last check for new images
        const lastImages = Array.from(document.getElementsByClassName(Variables.hoverImageClass));
        lastImages.forEach((imageElement: HTMLElement) => {
            // @ts-ignore
            imageLinkSet.add(imageElement.firstChild?.href);
        });

        return imageLinkSet;
    }

    collectDownloadLinks(imageLinkList: Set<string>): void {
        const self: this = this;
        imageLinkList.forEach((link: string) => {
            const xHttp: XMLHttpRequest = new XMLHttpRequest();
            xHttp.onreadystatechange = function (): void {
                if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                    self.contentList.push(...self.extractLinks(JSON.parse(this.response).graphql.shortcode_media));
                    self.resolvedContent += 1;
                } else if (this.readyState === XMLHttpRequest.DONE) {
                    self.resolvedContent += 1;
                }
            };
            xHttp.open('GET', link + '?__a=1', true);
            xHttp.send();

        });
    }

    private extractLinks(response: ShortcodeMedia): string[] {
        if (response.__typename === 'GraphImage') {

        } else if (response.__typename === 'GraphSidecar') {
            return [response.display_url];
        } else if (response.__typename === 'GraphVideo') {
            return [response.video_url];
        } else {
            const a = response.edge_sidecar_to_children;
        }
    }

    private downloadContent(resourceURLList: string[]): void {
        const downloadMessage: BulkDownloadMessage = {
            imageURL: resourceURLList,
            accountName: null,
            type: ContentType.bulk,
        };
        // @ts-ignore
        browser.runtime.sendMessage(downloadMessage);
    }

    reinitialize(): void {
        this.remove();
        this.init();
    }

    remove(): void {
        super.remove('download-all-button');
    }

}
