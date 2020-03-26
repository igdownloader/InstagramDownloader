class MutationObserverSingleton extends MutationObserver {

    static instance: MutationObserver;

    constructor() {
        if (MutationObserverSingleton.instance) {
            return MutationObserverSingleton.instance;
        }

        super(MutationObserverSingleton.observerCallback);

        MutationObserverSingleton.instance = this;
        return MutationObserverSingleton.instance;
    }

    /**
     * Handle the observer callback
     */
    private static observerCallback(): void {
        const event = new Event('domchange');
        document.dispatchEvent(event);
    }
}
