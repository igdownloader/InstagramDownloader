'use strict';

/**
 * The base class of every downloader.
 */
class Downloader {
    private readonly observerSelector: string;
    readonly observer: MutationObserver;
    private readonly observerOptions: MutationObserverInit;

    /**
     * Create a new downloader. The selector will be used to attach the observer to an object
     * @param observerSelector A query selector
     * @param observerOptions Options for an observer
     */
    constructor(observerSelector?: string, observerOptions?: MutationObserverInit) {

        // Check if an observer is needed
        if (observerSelector === undefined) {
            return;
        }


        // Check if observer options have been provided
        if (observerOptions === undefined) {
            this.observerOptions = {
                childList: true,
                subtree: true,
            };
        } else {
            this.observerOptions = observerOptions;
        }

        this.observerSelector = observerSelector;
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
        let element: HTMLElement = document.querySelector(this.observerSelector);

        if (element === null) {
            console.debug('The element you submitted was not found. A fallback element will be used (body)');
            element = document.body;
        }

        this.observer.observe(element, this.observerOptions);
    }

    /**
     * Create a new downloader
     */
    public init(): void {
        throw new Error('You have to overwrite this function');
    }

    /**
     * Remove the downloader
     */
    public remove(): void {
        throw new Error('You have to overwrite this function');
    }

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
