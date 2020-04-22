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
        AddonManager.addBackgroundVariable();
        AddonManager.adjustForAndroid();

        this.addListeners();
        this.urlChangeEmitter.emitLocationEvent();
    }


    /**
     * Check if the browser is mobile
     * @returns  Is Mobile
     */

    private static isMobile(): boolean {
        return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    }

    /**
     * Hide the hover icons if the mobile firefox is detected
     */
    private static adjustForAndroid(): void {
        if (AddonManager.isMobile()) {
            const style: HTMLStyleElement = document.createElement('style');
            style.innerText = '' +
                '.hover-download-button, .account-download-button {' +
                '    display: none!important;' +
                '}';
            document.head.appendChild(style);
        }
    }

    /**
     * Add the download image as css variable
     */
    private static addBackgroundVariable(): void {
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
     * Add listeners for an url change
     */
    private addListeners(): void {
        this.urlChangeEmitter.emitter.addEventListener('home', () => {
            console.debug('home');
            this.removeAllDownloader();
            this.postDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('post', () => {
            console.debug('post');
            this.removeAllDownloader();
            this.postDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('explore', () => {
            console.debug('explore');
            this.hoverDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('story', () => {
            console.debug('story');
            this.removeAllDownloader();
            this.storyDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('chanel', () => {
            console.debug('chanel');
            this.removeAllDownloader();

            this.hoverDownloader.init();
            this.accountImageDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('tv', () => {
            console.debug('tv');
            this.removeAllDownloader();

            this.postDownloader.init();
            this.accountImageDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('saved', () => {
            console.debug('saved');
            this.removeAllDownloader();

            this.hoverDownloader.init();
            this.accountImageDownloader.init();
            this.bulkDownloader.init();

        });

        this.urlChangeEmitter.emitter.addEventListener('tagged', () => {
            console.debug('tagged');
            this.removeAllDownloader();

            this.hoverDownloader.init();
            this.accountImageDownloader.init();
            this.bulkDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('account', () => {
            // Bulk downloader
            console.debug('account');
            this.removeAllDownloader();

            this.bulkDownloader.init();
            this.accountImageDownloader.init();
            this.hoverDownloader.init();
        });

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

const _ = new AddonManager();

