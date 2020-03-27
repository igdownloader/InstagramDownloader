'use strict';

class BulkDownloader extends Downloader {

    private static insertAfter(newNode: HTMLElement, referenceNode: HTMLElement): void {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
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

            // TODO stop hover and account downloader

            self.displayStopSnackbar();

            const imageLinkList: Set<string> = await self.collectImageLinks();
            const downloadLinks: string[] = self.collectDownloadLinks(imageLinkList);
            self.downloadContent(downloadLinks);
        };
    }

    displayStopSnackbar(): void {
        document
    }

    async collectImageLinks(): Promise<Set<string>> {
        const imageLinkSet: Set<string> = new Set<string>();

        do {
            const images = Array.from(document.getElementsByClassName(Variables.hoverImageClass));
            images.forEach((imageElement: HTMLElement) => {
                // @ts-ignore
                imageLinkSet.add(imageElement.firstChild?.href);
            });

            // Scroll down
            window.scrollTo(0, document.body.scrollHeight);
            await sleep(20);
        } while (document.getElementsByClassName('some class')[0] === undefined);

        return imageLinkSet;
    }

    collectDownloadLinks(imageLinkList: Set<string>): string[] {
        return null;
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
