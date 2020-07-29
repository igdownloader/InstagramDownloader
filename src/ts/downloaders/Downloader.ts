/**
 * The base class of every downloader.
 */
abstract class Downloader {

    static observer: MutationObserverSingleton = new MutationObserverSingleton();
    private readonly reinitializeListener: () => void;

    constructor() {
        this.reinitializeListener = this.reinitialize.bind(this);
    }

    /**
     * Starts the observation of the submitted query element
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
        document.addEventListener('domchange', this.reinitializeListener);

        Downloader.startObservation();
    }


    /**
     * Remove the downloader
     */
    protected remove(className: string): void {
        // Disconnect the observer before you remove the download button so the observer does not get triggered
        Downloader.observer.disconnect();

        // Don`t listen to dom changes any more
        document.removeEventListener('domchange', this.reinitializeListener);

        this.removeHtmlElement(className);

        Downloader.startObservation();
    }

    /**
     * Remove the html elements
     * @param className The name of the elements which should be removed
     */
    private removeHtmlElement(className: string): void {
        // Remove all added elements if they have not already been removed
        const elements: HTMLElement[] = Array.from(document.getElementsByClassName(className)) as HTMLElement[];
        elements.forEach((element: HTMLElement) => {
            try {
                element.remove();
            } catch {
                console.debug('Could not remove the element');
            }
        });
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
