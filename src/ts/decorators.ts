/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (decorators.ts) is part of InstagramDownloader which is released under     *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/
// tslint:disable:no-any

import {Downloader} from './downloaders/Downloader';

const singletons: Record<string, any> = {};

export const singleton = <T extends new (...args: any[]) => any>(constructor: T) =>
    new Proxy(constructor, {
        construct(target: any, argArray: any, newTarget?: any): object {
            if (target.prototype !== newTarget.prototype) {
                return Reflect.construct(target, argArray, newTarget);
            }
            const constructorName = constructor.name;
            if (!singletons[constructorName]) {
                singletons[constructorName] = Reflect.construct(target, argArray, newTarget);
            }

            return singletons[constructorName];
        },
    });

export function stopObservation(_: object,
                                __: string,
                                descriptor: PropertyDescriptor): void {

    const value = descriptor.value;
    descriptor.value = (...args: any) => {
        Downloader.observer.disconnect();
        value(...args);
        Downloader.startObservation();
    };

}
