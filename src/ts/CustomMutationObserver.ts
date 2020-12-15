/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (MutationObserverSingleton.ts) is part of InstagramDownloader which is released under
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import {singleton} from './decorators';

@singleton
export class CustomMutationObserver extends MutationObserver {
    // tslint:disable-next-line:no-any
    private timeout: any = null;

    public constructor() {
        super(() => {

            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(() => {
                const event = new Event('domchange');
                document.dispatchEvent(event);
            }, 100);
        });
    }
}
