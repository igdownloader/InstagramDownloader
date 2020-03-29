'use strict';

/**
 * Create a new Addon manager (only once)
 */
class AddonManager {

    urlChangeEmitter: URLChangeEmitter = new URLChangeEmitter();

    postDownloader: PostDownloader = new PostDownloader();
    storyDownloader: StoryDownloader = new StoryDownloader();
    hoverDownloader: HoverDownloader = new HoverDownloader();
    accountImageDownloader: AccountImageDownloader = new AccountImageDownloader();
    bulkDownloader: BulkDownloader = new BulkDownloader();

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
        this.urlChangeEmitter.emitter.addEventListener('home', () => {
            console.log('home');
            this.removeAllDownloader();
            this.postDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('post', () => {
            console.log('post');
            this.removeAllDownloader();
            this.postDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('explore', () => {
            console.log('explore');
            this.hoverDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('story', () => {
            console.log('story');
            this.removeAllDownloader();
            this.storyDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('chanel', () => {
            console.log('chanel');
            this.removeAllDownloader();

            this.hoverDownloader.init();
            this.accountImageDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('tv', () => {
            console.log('tv');
            this.removeAllDownloader();

            this.postDownloader.init();
            this.accountImageDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('saved', () => {
            console.log('saved');
            this.removeAllDownloader();

            this.hoverDownloader.init();
            this.accountImageDownloader.init();
            this.bulkDownloader.init();

        });

        this.urlChangeEmitter.emitter.addEventListener('tagged', () => {
            console.log('tagged');
            this.removeAllDownloader();

            this.hoverDownloader.init();
            this.accountImageDownloader.init();
            this.bulkDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('account', () => {
            // Bulk downloader
            console.log('account');
            this.removeAllDownloader();

            this.bulkDownloader.init();
            this.accountImageDownloader.init();
            this.hoverDownloader.init();
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

        // @ts-ignore
        const instagramAddonImage = browser.runtime.getURL('icons/instagram.png');
        document.documentElement.style.setProperty('--instagram-addon-icon', `url(${instagramAddonImage}`);

    }

    /**
     * Remove every downloader which might be active
     */
    private removeAllDownloader(): void {
        this.storyDownloader.remove();
        this.postDownloader.remove();
        this.hoverDownloader.remove();
        this.bulkDownloader.remove();
        this.accountImageDownloader.remove();
    }
}

const addonManager = new AddonManager();
document.addEventListener('domchange', () => {
    console.log('change');
});
