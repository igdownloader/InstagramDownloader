class PostDownloader {

    async init() {

        await sleep(2000);

        const postList: HTMLElement[] = Array.from(document.getElementsByClassName(Variables.postWrapper)) as HTMLElement[];
        // TODO different window sizes

        postList.forEach((element: HTMLElement) => {
            const bookmarkElement: HTMLElement = element.getElementsByClassName(Variables.postBookmark)[0] as HTMLElement;

            const downloadButton: HTMLElement = document.createElement('span');
            downloadButton.setAttribute('class', 'post-download-button');
            bookmarkElement.appendChild(downloadButton);
        });
    }


    remove() {

    }
}

/**
 * Sleep
 * @param ms How long the program should pause
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

