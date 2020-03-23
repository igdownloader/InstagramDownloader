class URLChangeEmitter extends EventTarget {
    private url: string = 'definitely not an url';

    constructor() {
        super();
    }

    async startURLLister(): Promise<void> {
        while (true) {

            // Wait until the url changed once
            await this.urlChanged();

            // Process the changed url
            this.emitEvent();

        }
    }

    /**
     * If you await this function you will stay in it as long as the url does not change
     */
    private async urlChanged(): Promise<void> {

        // stay in the while loop until the url changes
        while (true) {
            if (this.url !== location.href) {
                this.url = location.href;
                break;
            }

            await this.sleep(10);
        }
    }

    /**
     * Sleep for a specific time
     * @param ms The ms you should sleep
     */
    private async sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Check the url and emit the right event
     */
    private emitEvent(): void {

        // Home
        if (/^https:\/\/www.instagram.com\/$/.test(this.url)) {
            this.dispatchEvent(new Event('home'));
        }

        // Post
        if (/https:\/\/www.instagram.com\/p\/[^/]$/.test(this.url)) {
            this.dispatchEvent(new Event('post'));
        }

        // Explore
        if (/https:\/\/www.instagram.com\/explore\/tags\/[^\/]$/.test(this.url)) {
            this.dispatchEvent(new Event('explore'));
        }

        // Story
        if (/https:\/\/www.instagram.com\/stories\/[^/]\/$/.test(this.url) ||
            /https:\/\/www.instagram.com\/stories\/highlights\/[^/]\/$/.test(this.url)) {
            this.dispatchEvent(new Event('story'));
        }

        // Chanel
        if (/https:\/\/www.instagram.com\/[^/]\/channel\/$/.test(this.url)) {
            this.dispatchEvent(new Event('chanel'));
        }

        // TV
        if (/https:\/\/www.instagram.com\/tv\/[^/]\/$/.test(this.url)) {
            this.dispatchEvent(new Event('tv'));
        }

        // Saved
        if (/https:\/\/www.instagram.com\/[^/]\/saved\/$/.test(this.url)) {
            this.dispatchEvent(new Event('saved'));
        }

        // Tagged
        if (/https:\/\/www.instagram.com\/[^/]\/tagged\/$/.test(this.url)) {
            this.dispatchEvent(new Event('tagged'));
        }

        // Account
        if (/https:\/\/www.instagram.com\/[^/]\/$/.test(this.url)) {
            this.dispatchEvent(new Event('account'));
        }

    }
}
