'use strict';

/**
 * The base class of every downloader.
 */
abstract class Downloader {
    private readonly observerSelector: string;
    readonly observer: MutationObserver;
    private readonly observerOptions: MutationObserverInit;

    /**
     * Create a new downloader. The selector will be used to attach the observer to an object
     */
    constructor(createObserver: boolean = true) {

        if (!createObserver) {
            return;
        }

        // Check if observer options have been provided
        this.observerOptions = {
            childList: true,
            subtree: true,
        };

        this.observer = new MutationObserver(this.observerCallback(this));
    }

    /**
     * Handle the observer callback
     * @param self The instance of the class
     */
    observerCallback(self: this): () => void {
        return () => {
            self.observer.disconnect();
            self.remove();
            self.init();
        };
    }


    /**
     * Starts the observation of the submittet query element
     */
    protected startObservation(): void {
        this.observer.observe(document.body, this.observerOptions);
    }

    /**
     * Create a new downloader
     */
    abstract init(): void;

    /**
     * Remove the downloader
     */
    abstract remove(): void;

    /**
     * Get the account name of a post
     * @param element The post element
     * @param accountClass The class the account has
     */
    protected getAccountName(element: HTMLElement, accountClass: string): string {
        let accountName: string;
        try {
            // @ts-ignore
            accountName = element.getElementsByClassName(accountClass)[0].innerText;
        } catch (e) {
            accountName = '';
        }
        return accountName;
    }
}
