class AccountImageDownloader extends Downloader {

    createDownloadButton(): void {
        const accountImageWrapper: HTMLElement = document.getElementsByClassName(Variables.accountImageWrapperClass)[0] as HTMLElement;
        if (accountImageWrapper === undefined) {
            return;
        }
        const downloadButton: HTMLElement = document.createElement('a');
        downloadButton.setAttribute('class', 'h-v-center account-download-button');
        downloadButton.onclick = this.issueDownload(accountImageWrapper);
        accountImageWrapper.appendChild(downloadButton);

        const downloadImage: HTMLImageElement = document.createElement('img');
        // @ts-ignore
        downloadImage.src = browser.runtime.getURL('icons/download_white.png');
        downloadButton.appendChild(downloadImage);

    }

    issueDownload(accountElement: HTMLElement): () => void {
        return () => {
            const image = accountElement.getElementsByTagName('img')[0] as HTMLImageElement;
            const contentURL = image.src;
            this.downloadContent(contentURL);
        };
    }

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

    reinitialize(): void {
        this.remove();
        this.init();

    }

    remove(): void {
        super.remove('test');
    }


}
