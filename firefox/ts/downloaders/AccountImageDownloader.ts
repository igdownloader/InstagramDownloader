class AccountImageDownloader extends Downloader {

    createDownloadButton(): void {
        const accountImageWrapper: HTMLElement = document.getElementsByClassName(Variables.accountImageClass)[0] as HTMLElement;
        if (accountImageWrapper === undefined) {
            return;
        }
        const downloadButton: HTMLElement = document.createElement('a');
        downloadButton.setAttribute('class', 'h-v-center account-download-button');
        accountImageWrapper.appendChild(downloadButton);

        const downloadImage: HTMLImageElement = document.createElement('img');
        // @ts-ignore
        downloadImage.src = browser.runtime.getURL('icons/download_white.png');
        downloadButton.appendChild(downloadImage);

    }

    reinitialize(): void {
        this.remove();
        this.init();

    }

    remove(): void {
        super.remove('test');
    }


}
