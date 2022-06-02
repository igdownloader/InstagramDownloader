/****************************************************************************************
 * Copyright (c) 2022. HuiiBuh                                                          *
 * This file (DomObserver.ts) is part of InstagramDownloader which is not released      *
 * under any licence.                                                                   *
 * Any usage of this code outside this project is not allowed.                          *
 ****************************************************************************************/

import { singleton } from '../decorators';
import { Emitter } from './EventHandler';

/**
 * Firefox bug which does not let me inherit from MutationObserver
 */
@singleton
export class DomObserver extends Emitter<null> implements MutationObserver {
    // tslint:disable-next-line:no-any
    private timeout: any = null;
    private mutationObserver: MutationObserver;

    public constructor() {
        super();
        this.mutationObserver = new MutationObserver(this.changeCallback.bind(this));
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
            this.emit(null);
        }, 100);
    }
}
