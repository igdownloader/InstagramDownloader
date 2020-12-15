/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (decorators.ts) is part of InstagramDownloader which is released under     *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/
// tslint:disable:no-any

import {Downloader} from './downloaders/Downloader';

export function singleton(constructor: any): any {
    return new Proxy(constructor, {
        construct(target: any, argArray: any, newTarget?: any): object {
            if (target.prototype !== newTarget.prototype) {
                return Reflect.construct(target, argArray, newTarget);
            }
            if (!target.SINGLETON_INSTANCE) {
                target.SINGLETON_INSTANCE = Reflect.construct(target, argArray, newTarget);
            }

            return target.SINGLETON_INSTANCE;
        },
    });
}

export function stopObservation(_: object,
                                __: string,
                                descriptor: PropertyDescriptor): void {

    const value = descriptor.value;
    descriptor.value = function(): void {
        Downloader.observer.disconnect();
        value.apply(this, arguments);
        Downloader.observer.observe();
    };

}
