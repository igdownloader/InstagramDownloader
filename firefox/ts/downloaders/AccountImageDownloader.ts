class AccountImageDownloader extends Downloader {

    init(): void {
        this.createDownloadButton();
    }

    private createDownloadButton(): void {
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

    remove(): void {
        this.observer.disconnect();
    }


}
