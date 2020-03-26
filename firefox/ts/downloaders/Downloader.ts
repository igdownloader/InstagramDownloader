'use strict';

/**
 * The base class of every downloader.
 */
abstract class Downloader {

    static observer: MutationObserverSingleton = new MutationObserverSingleton();

    private observerOptions: MutationObserverInit = {
        childList: true,
        subtree: true,
    };

    constructor() {
        document.addEventListener('domchange', () => {
            this.reinitialize();
        });
    }

    abstract createDownloadButton(): void;

    abstract reinitialize(): void;

    /**
     * Starts the observation of the submittet query element
     */
    protected startObservation(): void {
        Downloader.observer.observe(document.body, this.observerOptions);
    }


    /**
     * Remove the downloader
     */
    protected remove(className: string): void {
        Downloader.observer.disconnect();

        const elements: HTMLElement[] = Array.from(document.getElementsByClassName(className)) as HTMLElement[];
        elements.forEach((element: HTMLElement) => {
            try {
                element.remove();
            } catch {
            }
        });

        this.startObservation();
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

    /**
     * Create a new downloader
     */
    public init(): void {
        Downloader.observer.disconnect();
        this.createDownloadButton();
        this.startObservation();
    }
}
