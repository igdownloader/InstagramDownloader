class AddonManager {

    urlChangeEmitter: URLChangeEmitter = new URLChangeEmitter();
    private postDownloader: PostDownloader = new PostDownloader();

    constructor() {
        this.addBackgroundVariable();
        this.addListeners();

        this.urlChangeEmitter.emitLocationEvent();

    }

    addListeners(): void {
        this.urlChangeEmitter.emitter.addEventListener('home', () => {
            console.log('home');
        });

        this.urlChangeEmitter.emitter.addEventListener('post', async () => {
            console.log('post');
            await this.postDownloader.init();
        });

        this.urlChangeEmitter.emitter.addEventListener('explore', () => {
            console.log('explore');

        });

        this.urlChangeEmitter.emitter.addEventListener('story', () => {
            console.log('story');

        });

        this.urlChangeEmitter.emitter.addEventListener('chanel', () => {
            console.log('chanel');

        });

        this.urlChangeEmitter.emitter.addEventListener('tv', () => {
            console.log('tv');

        });

        this.urlChangeEmitter.emitter.addEventListener('saved', () => {
            console.log('saved');

        });

        this.urlChangeEmitter.emitter.addEventListener('tagged', () => {
            console.log('tagged');

        });

        this.urlChangeEmitter.emitter.addEventListener('account', () => {
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
