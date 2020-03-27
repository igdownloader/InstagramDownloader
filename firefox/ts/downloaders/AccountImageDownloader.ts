'use strict';

/**
 * Downloader which can be used to download account images
 */
class AccountImageDownloader extends Downloader {

    /**
     * Create a new download button
     */
    createDownloadButton(): void {
        const accountImageWrapper: HTMLElement = document.getElementsByClassName(Variables.accountImageWrapperClass)[0] as HTMLElement;
        if (accountImageWrapper === undefined) {
            return;
        }
        const downloadButton: HTMLElement = document.createElement('a');
        downloadButton.setAttribute('class', 'h-v-center account-download-button');
        downloadButton.onclick = this.addDownloadListener(accountImageWrapper);
        accountImageWrapper.appendChild(downloadButton);

        const downloadImage: HTMLImageElement = document.createElement('img');
        // @ts-ignore
        downloadImage.src = browser.runtime.getURL('icons/download_white.png');
        downloadButton.appendChild(downloadImage);

    }

    /**
     * Issue the download
     * @param accountElement The element with the account image in it
     */
    addDownloadListener(accountElement: HTMLElement): () => void {
        return () => {
            const image = accountElement.getElementsByTagName('img')[0] as HTMLImageElement;
            const contentURL = image.src;
            this.downloadContent(contentURL);
        };
    }

    /**
     * Download the account image
     * @param resourceURL The url of the account image
     */
    private downloadContent(resourceURL: string): void {
        const accountName = this.getAccountName(document.body, Variables.accountNameClass);

        const downloadMessage: DownloadMessage = {
            imageURL: resourceURL,
            accountName,
            type: ContentType.single,
        };
        // @ts-ignore
        browser.runtime.sendMessage(downloadMessage);
    }

    /**
     * Reinitialize the downloader
     */
    reinitialize(): void {
        this.remove();
        this.init();

    }

    /**
     * Remove the downloader
     */
    remove(): void {
        super.remove('account-download-button');
    }


}
