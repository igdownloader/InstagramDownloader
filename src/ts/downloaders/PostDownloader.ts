/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (PostDownloader.ts) is part of InstagramDownloader which is released under *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

/**
 * A downloader which can be used for instagram posts
 */
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
        const left = postElement.getElementsByClassName(Variables.leftArrowClass).length > 0;
        const right = postElement.getElementsByClassName(Variables.rightArrowClass).length > 0;

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

    /**
     * Create a new download button
     */
    createDownloadButton(): void {
        const postList: HTMLElement[] = Array.from(document.getElementsByClassName(Variables.postWrapperClass)) as HTMLElement[];
        postList.forEach((element: HTMLElement) => {
            this.addDownloadButton(element);
        });
    }

    /**
     * Add the download button to the posts on the page
     * @param element The Post the download button should be added to
     */
    private addDownloadButton(element: HTMLElement): void {
        const accountName = this.getAccountName(element, Variables.postAccountNameClass);

        const bookmarkElement: HTMLElement = element.getElementsByClassName(Variables.postBookmarkClass)[0] as HTMLElement;
        const downloadButton: HTMLElement = document.createElement('span');
        downloadButton.setAttribute('class', 'post-download-button');
        bookmarkElement.appendChild(downloadButton);

        downloadButton.onclick = this.downloadContent(accountName, element);
    }


    /**
     * Issue a download
     * @param accountName The account name of the image uploader
     * @param element The element of the post
     */
    private downloadContent(accountName: string, element: HTMLElement): () => void {

        return () => {
            const image: Image = PostDownloader.getDownloadImageSRC(element);

            const downloadMessage: DownloadMessage = {
                imageURL: [image.imageSRC],
                accountName,
                type: image.type,
            };
            // @ts-ignore
            browser.runtime.sendMessage(downloadMessage);
        };
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
    public remove(): void {
        super.remove('post-download-button');
    }
}

