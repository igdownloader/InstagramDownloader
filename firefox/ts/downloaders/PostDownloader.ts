'use strict';

class PostDownloader extends Downloader {
    /**
     * Get the src of the download content
     * @param element The post
     */
    private static getDownloadImageSRC(element: HTMLElement): Image {

        // @ts-ignore
        const sliderPost: HTMLElement[] = [...element.getElementsByClassName(Variables.sliderClass)];
        if (sliderPost.length > 0) {
            return this.getSliderPost(sliderPost, element);
        }


        // Get all images and videos of the post
        const images: HTMLCollectionOf<HTMLElement> = element.getElementsByClassName(Variables.imageClass) as HTMLCollectionOf<HTMLElement>;
        const videos: HTMLCollectionOf<HTMLElement> = element.getElementsByClassName(Variables.videoClass) as HTMLCollectionOf<HTMLElement>;
        // @ts-ignore
        const imageSRC: string = [...images, ...videos][0].src;


        return {
            imageSRC,
            type: ContentType.single,
        };
    }

    /**
     * Get the current image in a slider post and return the image
     * @param sliderPost The images/videos in the slider post
     * @param postElement The main post
     */
    private static getSliderPost(sliderPost: HTMLElement[], postElement: HTMLElement): Image {

        // Collect the posts in the slider
        const posts: string[] = [];


        // Add the src of the images ot the post
        sliderPost.forEach((post: HTMLElement) => {
            const images: HTMLCollectionOf<HTMLElement> = post.getElementsByClassName(Variables.imageClass) as HTMLCollectionOf<HTMLElement>;
            const videos: HTMLCollectionOf<HTMLElement> = post.getElementsByClassName(Variables.videoClass) as HTMLCollectionOf<HTMLElement>;
            // @ts-ignore
            const contentSRC: string = [...images, ...videos][0].src;
            posts.push(contentSRC);
        });

        // Check where the post is currently
        const left = postElement.getElementsByClassName(Variables.leftArrow).length > 0;
        const right = postElement.getElementsByClassName(Variables.rightArrow).length > 0;

        // Get the right image
        let currentPostSRC: string;
        if (left && right) {
            currentPostSRC = posts[1];
        } else if (left) {
            currentPostSRC = posts.pop();
        } else if (right) {
            currentPostSRC = posts[0];
        }

        return {
            type: ContentType.single,
            imageSRC: currentPostSRC,
        };

    }

    public async init(): Promise<void> {

        await sleep(2000);
        this.addDownloadButton();

    }


    /**
     * Add the download button to the posts on the page
     */
    private addDownloadButton(): void {
        const postList: HTMLElement[] = Array.from(document.getElementsByClassName(Variables.postWrapper)) as HTMLElement[];
        postList.forEach((element: HTMLElement) => {
            this.createDownloadButton(element);
        });
    }

    /**
     * Create a new download button
     * @param element The Post the download button should be added to
     */
    private createDownloadButton(element: HTMLElement): void {
        const accountName = this.getAccountName(element);

        const bookmarkElement: HTMLElement = element.getElementsByClassName(Variables.postBookmark)[0] as HTMLElement;
        const downloadButton: HTMLElement = document.createElement('span');
        downloadButton.setAttribute('class', 'post-download-button');
        bookmarkElement.appendChild(downloadButton);

        downloadButton.onclick = this.downloadImage(accountName, element);
    }


    /**
     * Issue a download
     * @param accountName The account name of the image uploader
     * @param element The element of the post
     */
    private downloadImage(accountName: string, element: HTMLElement): () => void {

        return () => {
            const image: Image = PostDownloader.getDownloadImageSRC(element);

            const downloadMessage: DownloadMessage = {
                imageURL: image.imageSRC,
                accountName,
                type: image.type,
            };
            // @ts-ignore
            browser.runtime.sendMessage(downloadMessage);
        };
    }


    public remove(): void {
        // @ts-ignore
        const downloadButtons: HTMLElement[] = [...document.getElementsByClassName('post-download-button')];
        downloadButtons.forEach((element: HTMLElement) => {
            try {
                element.remove();
            } catch (e) {
                console.log('Could not remove the download button');
            }
        });
    }
}

