'use strict';

class HoverDownloader extends Downloader {


    private static getResourceURL(response: any): string {
        if (response.__typename === 'GraphVideo') {
            return response.video_url;
        } else {
            return response.display_url;
        }
    }

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
            imageElement.appendChild(downloadButton);

            const downloadImage: HTMLImageElement = document.createElement('img');
            // @ts-ignore
            downloadImage.src = browser.runtime.getURL('icons/download_white.png');
            downloadButton.appendChild(downloadImage);
        });

    }

    private addDownloadListener(imageElement: HTMLAnchorElement): () => void {
        return () => {
            const href = imageElement.href;
            const requestURL: string = `${href}?__a=1`;
            this.downloadImage(requestURL);
        };
    }

    private async downloadImage(requestURL: string): Promise<void> {
        const response: any = await this.makeAPIRequest(requestURL);
        const resourceURL = HoverDownloader.getResourceURL(response);

        const accountName = this.getAccountName(document.body, Variables.accountNameClass);

        const downloadMessage: DownloadMessage = {
            imageURL: resourceURL,
            accountName,
            type: ContentType.single,
        };
        // @ts-ignore
        browser.runtime.sendMessage(downloadMessage);
    }

    private async makeAPIRequest(requestURL: string): Promise<any> {
        return new Promise<object>(((resolve, reject) => {

                const apiRequest: XMLHttpRequest = new XMLHttpRequest();

                apiRequest.onreadystatechange = function (): void {
                    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                        const response = JSON.parse(this.responseText);
                        resolve(response.graphql.shortcode_media);
                    } else if (this.readyState === XMLHttpRequest.DONE) {
                        reject(new Error('Could not connect to the instagram API.'));
                    }
                };
                apiRequest.open('GET', requestURL);
                apiRequest.send();

            }),
        );
    }

    public remove(): void {
        const downloadButtons: HTMLElement[] = Array.from(document.getElementsByClassName('h-v-center account-download-button')) as HTMLElement[];
        downloadButtons.forEach((downloadButton: HTMLElement) => {
            downloadButton.remove();
        });
    }

}
