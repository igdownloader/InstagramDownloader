/****************************************************************************************
 * Copyright (c) 2021. HuiiBuh                                                          *
 * This file (EventHandler.ts) is part of InstagramDownloader which is released under   *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/
// tslint:disable:no-any

type Callback<T> = (data: T | null) => any;

export class Emitter<T> {

    private subscribers: Callback<T>[] = [];

    public subscribe(callback: Callback<T>): Subscription {
        if (!this.subscribers.includes(callback)) {
            this.subscribers.push(callback);
        }

        return new Subscription(callback, this.subscribers);
    }

    protected emit(data: T | null = null): void {
        for (const subscriber of this.subscribers) {
            subscriber(data);
        }
    }
}

export class TopicEmitter {
    private subscribers: Record<string, Callback<any>[]> = {};

    public on(topic: string, callback: Callback<any>): Subscription {

        if (!(topic in this.subscribers)) {
            this.subscribers[topic] = [];
        }

        const topicListeners = this.subscribers[topic];
        if (!topicListeners.includes(callback)) {
            topicListeners.push(callback);
        }

        return new Subscription(callback, this.subscribers[topic]);
    }

    public emit(topic: string, data: any = null): void {
        if (!(topic in this.subscribers)) return;

        for (const subscriber of this.subscribers[topic]) {
            subscriber(data);
        }
    }

}

export interface SubscriptionInterface {
    unsubscribe(): void;
}

export class Subscription implements SubscriptionInterface {

    public constructor(private callback: Callback<any>, private subscribers: Callback<any>[]) {
    }

    public unsubscribe(): void {
        if (this.subscribers.includes(this.callback)) {
            this.subscribers.splice(this.subscribers.findIndex(c => c === this.callback), 1);
        }
    }
}
