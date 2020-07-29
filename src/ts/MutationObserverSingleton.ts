/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (MutationObserverSingleton.ts) is part of InstagramDownloader which is released under
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

class MutationObserverSingleton extends MutationObserver {

    constructor() {
        super(MutationObserverSingleton.observerCallback);

        if (MutationObserverSingleton.instance) {
            return MutationObserverSingleton.instance;
        }


        MutationObserverSingleton.instance = this;
        return MutationObserverSingleton.instance;
    }

    private static instance: MutationObserverSingleton;

    private static timeout: any = null;

    /**
     * Handle the observer callback
     */
    private static observerCallback(): void {

        if (MutationObserverSingleton.timeout) {
            clearTimeout(MutationObserverSingleton.timeout);
        }

        MutationObserverSingleton.timeout = setTimeout(() => {
            const event = new Event('domchange');
            document.dispatchEvent(event);
        }, 100);
    }
}
