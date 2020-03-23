class PostDownloader {

    async init() {

        await sleep(2000);

        const postList: HTMLElement[] = Array.from(document.getElementsByClassName(Variables.postWrapper)) as HTMLElement[];
        postList.forEach((element: HTMLElement) => {
            const bookmarkElement: HTMLElement = element.getElementsByClassName(Variables.postBookmark)[0] as HTMLElement;

            const downloadButton: HTMLElement = document.createElement('span');
            downloadButton.setAttribute('class', 'post-download-button');
            downloadButton.style.background = 'red';
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

