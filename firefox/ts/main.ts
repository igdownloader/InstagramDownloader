'use strict';

/**
 * Create a new Addon manager (only once)
 */
class AddonManager {

    urlChangeEmitter: URLChangeEmitter = new URLChangeEmitter();

    private postDownloader: PostDownloader = new PostDownloader();
    private storyDownloader: StoryDownloader = new StoryDownloader();
    private hoverDownloader: HoverDownloader = new HoverDownloader();

    private accountImageDownloader: AccountImageDownloader = new AccountImageDownloader();

    /**
     * Create a new Addon manager. This class has to be constructed only once
     */
    constructor() {
        this.addBackgroundVariable();
        this.addListeners();

        this.urlChangeEmitter.emitLocationEvent();

    }

    /**
     * Add listeners for an url change
     */
    addListeners(): void {
        this.urlChangeEmitter.emitter.addEventListener('home', async () => {
            console.log('home');
            this.removeAllDownloader();
            await this.postDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('post', async () => {
            console.log('post');
            this.removeAllDownloader();
            await this.postDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('explore', async () => {
            console.log('explore');
            await this.hoverDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('story', async () => {
            console.log('story');
            this.removeAllDownloader();
            await this.storyDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('chanel', async () => {
            console.log('chanel');
            await this.hoverDownloader.init();
            this.accountImageDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('tv', async () => {
            console.log('tv');
            await this.postDownloader.init();
            this.accountImageDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('saved', async () => {
            // Bulk downloader
            console.log('saved');
            this.hoverDownloader.init();
            this.accountImageDownloader.init();

        });

        this.urlChangeEmitter.emitter.addEventListener('tagged', async () => {
            // Bulk downloader
            console.log('tagged');
            this.hoverDownloader.init();
            this.accountImageDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('account', async () => {
            // Bulk downloader
            console.log('account');
            this.hoverDownloader.init();
            this.accountImageDownloader.init();
        });

    }

    /**
     * Add the download image as css variable
     */
    private addBackgroundVariable(): void {
        // @ts-ignore
        const downloadImageBlack = browser.runtime.getURL('icons/download_black.png');
        document.documentElement.style.setProperty('--download-image-black', `url(${downloadImageBlack}`);

        // @ts-ignore
        const downloadImageWhite = browser.runtime.getURL('icons/download_white.png');
        document.documentElement.style.setProperty('--download-image-white', `url(${downloadImageWhite}`);
    }

    /**
     * Remove every downloader which might be active
     */
    private removeAllDownloader(): void {
        this.storyDownloader.remove();
        this.postDownloader.remove();
        this.hoverDownloader.remove();
    }
}

const _ = new AddonManager();
