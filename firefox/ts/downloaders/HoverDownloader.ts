'use strict';

/**
 * A downloader which can be used to hover over images and download them
 */
class HoverDownloader extends Downloader {

    /**
     * Take the api response from instagram and return the content url
     * @param response The api response from instagram
     */
    private static getResourceURL(response: ShortcodeMedia): string {
        if (response.__typename === 'GraphVideo') {
            return response.video_url;
        } else {
            return response.display_url;
        }
    }

    /**
     * Get the download link in relation to the download button
     * @param downloadButton The earlier created download button
     */
    private static getContentLink(downloadButton: HTMLElement): string {
        // @ts-ignore
        if (downloadButton.parentElement?.href !== undefined) {
            // @ts-ignore
            return downloadButton.parentElement.href;
        }

        // @ts-ignore
        return downloadButton.parentElement.firstChild?.href;
    }

    /**
     * Create download button for every image
     */
    createDownloadButton(): void {
        const imageList: HTMLElement[] = Array.from(document.getElementsByClassName(Variables.hoverImageClass)) as HTMLElement[];

        imageList.forEach((imageElement: HTMLElement) => {
            const downloadButton: HTMLElement = document.createElement('a');
            downloadButton.setAttribute('class', `h-v-center hover-download-button`);

            downloadButton.onclick = this.addDownloadListener();
            imageElement.appendChild(downloadButton);

            const downloadImage: HTMLImageElement = document.createElement('img');
            // @ts-ignore
            downloadImage.src = browser.runtime.getURL('icons/download_white.png');
            downloadButton.appendChild(downloadImage);
        });

    }

    /**
     * Add a click listener to the download button
     */
    private addDownloadListener(): (event: MouseEvent) => void {
        return async (event: MouseEvent) => {
            event.preventDefault();

            const target: HTMLElement = event.currentTarget as HTMLElement;
            const href: string = HoverDownloader.getContentLink(target);

            const requestURL: string = `${href}?__a=1`;
            await this.downloadContent(requestURL);
        };
    }

    /**
     * Download the actual content
     * @param requestURL The instagram api url
     */
    private async downloadContent(requestURL: string): Promise<void> {
        const response: ShortcodeMedia = await this.makeAPIRequest(requestURL);
        const resourceURL = HoverDownloader.getResourceURL(response);

        const accountName = this.getAccountName(response);

        const downloadMessage: DownloadMessage = {
            imageURL: [resourceURL],
            accountName,
            type: ContentType.single,
        };
        // @ts-ignore
        browser.runtime.sendMessage(downloadMessage);
    }

    /**
     * Get the account name with the api response
     * @param response The instagram api response
     */
    getAccountName(response: any): string {
        try {
            return response.owner.username;
        } catch {
            return '';
        }
    }

    /**
     * Make a api request which returns the response to this request
     * @param requestURL The url the request should be made to
     */
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

    /**
     * Reinitialize the downloader
     */
    reinitialize(): void {
        this.remove();
        this.init();

    }

    /**
     * Remove all download buttons
     */
    public remove(): void {
        super.remove('hover-download-button');
    }


}
