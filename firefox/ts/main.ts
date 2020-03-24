class AddonManager {

    urlChangeEmitter: URLChangeEmitter = new URLChangeEmitter();
    private postDownloader: PostDownloader = new PostDownloader();

    constructor() {
        this.addBackgroundVariable();
        this.addListeners();

        this.urlChangeEmitter.emitLocationEvent();

    }

    addListeners(): void {
        this.urlChangeEmitter.emitter.addEventListener('home', async () => {
            console.log('home');
            await this.postDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('post', async () => {
            console.log('post');
            await this.postDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('explore', () => {
            // Hover downloader
            console.log('explore');
        });

        this.urlChangeEmitter.emitter.addEventListener('story', () => {
            // Story downloader
            console.log('story');
        });

        this.urlChangeEmitter.emitter.addEventListener('chanel', () => {
            // Hover downloader
            console.log('chanel');
        });

        this.urlChangeEmitter.emitter.addEventListener('tv', async () => {
            console.log('tv');
            await this.postDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('saved', () => {
            // Hover downloader
            // Bulk downloader
            console.log('saved');
        });

        this.urlChangeEmitter.emitter.addEventListener('tagged', () => {
            // Hover downloader
            // Bulk downloader
            console.log('tagged');
        });

        this.urlChangeEmitter.emitter.addEventListener('account', () => {
            // Hover downloader
            // Bulk downloader
            console.log('account');
        });

    }

    private addBackgroundVariable(): void {
        // @ts-ignore
        const downloadImage = browser.runtime.getURL('icons/download.png');
        document.documentElement.style.setProperty('--download-image', `url(${downloadImage}`);
    }
}

const _ = new AddonManager();
