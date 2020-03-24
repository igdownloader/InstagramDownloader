'use strict';

class StoryDownloader extends Downloader {

    async init(): Promise<void> {
        await sleep(200);
        this.createDownloadButton();
    }


    createDownloadButton(): void {
        const downloadButton: HTMLElement = document.createElement('span');
        downloadButton.setAttribute('class', 'story-download-button');
        document.body.appendChild(downloadButton);

        const accountName = this.getAccountName(document.body, Variables.storyAccountName);
        downloadButton.onclick = this.downloadImage(accountName);
    }

    private downloadImage(accountName: string): () => void {
        return () => {
            const video = document.getElementsByTagName('source')[0];
            const img = document.getElementsByClassName(Variables.storyImageClass)[0] as HTMLImageElement;

            let url: string;
            if (video !== undefined) {
                url = video.src;
            } else if (img !== undefined) {
                url = img.src;
            }

            const downloadMessage: DownloadMessage = {
                imageURL: url,
                accountName,
                type: ContentType.single,
            };
            // @ts-ignore
            browser.runtime.sendMessage(downloadMessage);

        };
    }

    remove(): void {

        // @ts-ignore
        const downloadButtons: HTMLElement[] = [...document.getElementsByClassName('story-download-button')];
        downloadButtons.forEach((element: HTMLElement) => {
            try {
                element.remove();
            } catch {
            }
        });
    }
}
