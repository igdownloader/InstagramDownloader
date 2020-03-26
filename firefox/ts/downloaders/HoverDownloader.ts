'use strict';

class HoverDownloader extends Downloader {

    async init(): Promise<void> {
        await sleep(2000);
        this.createDownloadButton();
    }

    private createDownloadButton(): void {
        const imageList: HTMLElement[] = Array.from(document.getElementsByClassName(Variables.accountImageClass)) as HTMLElement[];

        imageList.forEach((imageElement: HTMLElement) => {
            const downloadButton: HTMLElement = document.createElement('a');
            downloadButton.setAttribute('class', 'h-v-center account-download-button');
            downloadButton.onclick = this.addDownloadListener(imageElement.firstChild as HTMLAnchorElement);


            const downloadImage: HTMLImageElement = document.createElement('img');
            // @ts-ignore
            downloadImage.src = browser.runtime.getURL('icons/download_white.png');
            downloadButton.appendChild(downloadImage);

            imageElement.appendChild(downloadButton);

        });

    }

    private addDownloadListener(imageElement: HTMLAnchorElement): () => void {
        return () => {
            const href = imageElement.href;
            const requestURL: string = `https://instagram.com/${href}?__a=1`;
            this.downloadImage(requestURL);
        };
    }

    private downloadImage(requestURL: string): void {
        const apiRequest: XMLHttpRequest = new XMLHttpRequest();
        apiRequest.onload = (response) => {
            console.log(response);
        };
        apiRequest.open('GET', requestURL);
        apiRequest.send();
    }

    public remove(): void {
        const downloadButtons: HTMLElement[] = Array.from(document.getElementsByClassName('h-v-center account-download-button')) as HTMLElement[];
        downloadButtons.forEach((downloadButton: HTMLElement) => {
            downloadButton.remove();
        });
    }
}
