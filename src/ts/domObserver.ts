/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (MutationObserverSingleton.ts) is part of InstagramDownloader which is released under
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import {singleton} from './decorators';

/**
 * Firefox bug which does not let me inherit from MutationObserver
 */
@singleton
export class DomObserver implements MutationObserver {
    // tslint:disable-next-line:no-any
    private timeout: any = null;
    private callbackList: (() => void)[] = [];
    private mutationObserver: MutationObserver;

    public constructor() {
        this.mutationObserver = new MutationObserver(this.changeCallback.bind(this));

    }

    public addCallback(callback: () => void): void {
        // TODO callbacks get called every time even if the downloader is not supposed to be called
        this.callbackList.push(callback);
    }

    /**
     * Stop observing for changes
     */
    public disconnect(): void {
        this.mutationObserver.disconnect();
    }

    /**
     * Observe the body for changes
     */
    public observe(): void {
        const options: MutationObserverInit = {
            childList: true,
            subtree: true,
        };
        this.mutationObserver.observe(document.body, options);
    }

    /**
     * Empties the record queue and returns what was in there.
     */
    public takeRecords(): MutationRecord[] {
        return this.mutationObserver.takeRecords();
    }

    private changeCallback(): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.callbackList.forEach(c => c());
        }, 100);
    }
}
