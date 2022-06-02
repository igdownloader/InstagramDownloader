/****************************************************************************************
 * Copyright (c) 2022. HuiiBuh                                                          *
 * This file (URLChangeEmitter.ts) is part of InstagramDownloader which is not released *
 * under any licence.                                                                   *
 * Any usage of this code outside this project is not allowed.                          *
 ****************************************************************************************/

import { TopicEmitter } from './EventHandler';

/**
 * Subscribe to the emitter of this class to get the current instagram page
 */
export class URLChangeEmitter extends TopicEmitter {

    private url: string = location.href;

    /**
     * Add a location change event dispatcher
     */
    public constructor() {
        super();
        URLChangeEmitter.addLocationChangeListener();
        this.subscribeToLocationChangeListener();
    }

    public static isHome(url: string): boolean {
        return /^https:\/\/www\.instagram\.com\/(\?.*)*$/.test(url);
    }

    public static isPost(url: string): boolean {
        // The normal posts
        return /https:\/\/www\.instagram\.com\/p\/[^/]*\/(\?.*)*$/.test(url) ||
            // The reel page
            /https:\/\/www\.instagram\.com\/reel\/[^/]*\/(\?.*)*$/.test(url);
    }

    public static isExplore(url: string): boolean {
        return /https:\/\/www\.instagram\.com\/explore\/tags\/[^\/]*\/(\?.*)*$/.test(url) ||
            /https:\/\/www\.instagram\.com\/explore\/$/.test(url);
    }

    public static isStory(url: string): boolean {
        return /https:\/\/www\.instagram\.com\/stories\/[^/]*\/[^/]*\/(\?.*)*$/.test(url) ||
            /https:\/\/www\.instagram\.com\/stories\/highlights\/[^/]*\/(\?.*)*$/.test(url);
    }

    public static isChannel(url: string): boolean {
        return /https:\/\/www\.instagram\.com\/[^/]*\/channel\/(\?.*)*$/.test(url);
    }

    public static isReel(url: string): boolean {
        return /https:\/\/www\.instagram\.com\/[^/]*\/reels\/(\?.*)*$/.test(url);
    }

    public static isTV(url: string): boolean {
        return /https:\/\/www\.instagram\.com\/tv\/[^/]*\/(\?.*)*$/.test(url);
    }

    public static isSaved(url: string): boolean {
        return /https:\/\/www\.instagram\.com\/[^/]*\/saved\/(\?.*)*$/.test(url);
    }

    public static isTagged(url: string): boolean {
        return /https:\/\/www\.instagram\.com\/[^/]*\/tagged\/(\?.*)*$/.test(url);
    }

    public static isAccount(url: string): boolean {
        return /https:\/\/www\.instagram\.com\/[^/]*\/(\?.*)*$/.test(url) && !/.*explore\/$/.test(url);
    }

    /**
     * Add a replace state event listener
     * This fires a location change event from the windows element
     */
    private static addLocationChangeListener(): void {
        // Nice working with stable software!
        // Workaround because it does not work to let the extension execute the code
        const script: HTMLScriptElement = document.createElement('script');
        script.id = 'instagram-downloader';
        script.innerText = `
        history.pushState = (f => function pushState() {
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        })(history.pushState);

        history.replaceState = (f => function replaceState() {
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        })(history.replaceState);

        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'))
        });
        `;
        document.head.appendChild(script);
    }

    /**
     * Check the url and emit the right event
     */
    public emitLocationEvent(): void {

        // Home
        if (URLChangeEmitter.isHome(this.url)) {
            this.emit('home');
        }

        // Post
        if (URLChangeEmitter.isPost(this.url)) {
            this.emit('post');
        }

        // Explore
        if (URLChangeEmitter.isExplore(this.url)) {
            this.emit('explore');
        }

        // Story
        if (URLChangeEmitter.isStory(this.url)) {
            this.emit('story');
        }

        // Channel
        if (URLChangeEmitter.isChannel(this.url)) {
            this.emit('channel');
        }

        // TV
        if (URLChangeEmitter.isTV(this.url)) {
            this.emit('tv');
        }

        // Saved
        if (URLChangeEmitter.isSaved(this.url)) {
            this.emit('saved');
        }

        // Tagged
        if (URLChangeEmitter.isTagged(this.url)) {
            this.emit('tagged');
        }

        // Account
        if (URLChangeEmitter.isAccount(this.url)) {
            this.emit('account');
        }

        // Reel
        if (URLChangeEmitter.isReel(this.url)) {
            this.emit('reels');
        }

    }

    /**
     * Subscribe to the location change listener and emit a event if the location has changed
     */
    private subscribeToLocationChangeListener(): void {
        window.addEventListener('locationchange', () => {
            if (this.url !== location.href) {
                this.url = location.href;
                this.emitLocationEvent();
            }
        });
    }
}
