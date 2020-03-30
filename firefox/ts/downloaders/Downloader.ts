'use strict';

/**
 * The base class of every downloader.
 */
abstract class Downloader {

    static observer: MutationObserverSingleton = new MutationObserverSingleton();

    /**
     * Create a new downloader
     */
    constructor() {

        // Listen to dom change and remove and add the downloader after every change
        document.addEventListener('domchange', () => {
            this.reinitialize();
        });
    }


    /**
     * Starts the observation of the submittet query element
     */
    private static startObservation(): void {
        const observerOptions: MutationObserverInit = {
            childList: true,
            subtree: true,
        };
        Downloader.observer.observe(document.body, observerOptions);
    }

    /**
     * This method has to create a new download button
     */
    abstract createDownloadButton(): void;

    /**
     * This method has to remove and initialize the downloader
     */
    abstract reinitialize(): void;

    /**
     * Create a new downloader
     */
    public init(): void {
        // Disconnect the observer before you add the download button so the observer does not get triggered
        Downloader.observer.disconnect();
        this.createDownloadButton();
        Downloader.startObservation();
    }


    /**
     * Remove the downloader
     */
    protected remove(className: string): void {
        // Disconnect the observer before you remove the download button so the observer does not get triggered
        Downloader.observer.disconnect();

        // Remove all added elements if they have not already been removed
        const elements: HTMLElement[] = Array.from(document.getElementsByClassName(className)) as HTMLElement[];
        elements.forEach((element: HTMLElement) => {
            try {
                element.remove();
            } catch {
                console.debug('Could not remove the element');
            }
        });

        Downloader.startObservation();
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
        } catch {
            accountName = '';
        }
        return accountName;
    }

}
