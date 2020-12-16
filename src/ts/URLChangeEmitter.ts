/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (URLChangeEmitter.ts) is part of InstagramDownloader which is released under
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import { TopicEmitter } from './events';

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

    /**
     * Add a replace state event listener
     * This fires a location change event from the windows element
     */
    private static addLocationChangeListener(): void {
        // Nice working with stable software!
        // Workaround because it does not work to let the extension execute the code
        const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
        const script: HTMLScriptElement = document.createElement('script');
        script.id = 'test';
        script.innerText = '' +
            'history.pushState = ( f => function pushState(){' +
            '    var ret = f.apply(this, arguments);' +
            '    window.dispatchEvent(\'pushstate\'));' +
            '    window.dispatchEvent(\'locationchange\'));' +
            '    return ret;' +
            '})(history.pushState);' +
            '' +
            'history.replaceState = ( f => function replaceState(){' +
            '    var ret = f.apply(this, arguments);' +
            '    window.dispatchEvent(\'replacestate\'));' +
            '    window.dispatchEvent(\'locationchange\'));' +
            '    return ret;' +
            '})(history.replaceState);' +
            '' +
            'window.addEventListener(\'popstate\',()=>{' +
            '    window.dispatchEvent(\'locationchange\'))' +
            '});';
        head.appendChild(script);
    }

    /**
     * Check the url and emit the right event
     */
    public emitLocationEvent(): void {

        // Home
        if (/^https:\/\/www\.instagram\.com\/(\?.*)*$/.test(this.url)) {
            this.emit('home');
        }

        // Post
        if (/https:\/\/www\.instagram\.com\/p\/[^/]*\/(\?.*)*$/.test(this.url)) {
            this.emit('post');
        }

        // Explore
        if (/https:\/\/www\.instagram\.com\/explore\/tags\/[^\/]*\/(\?.*)*$/.test(this.url)) {
            this.emit('explore');
        }

        // Story
        if (/https:\/\/www\.instagram\.com\/stories\/[^/]*\/[^/]*\/(\?.*)*$/.test(this.url) ||
            /https:\/\/www\.instagram\.com\/stories\/highlights\/[^/]*\/(\?.*)*$/.test(this.url)) {
            this.emit('story');
        }

        // Channel
        if (/https:\/\/www\.instagram\.com\/[^/]*\/channel\/(\?.*)*$/.test(this.url)) {
            this.emit('channel');
        }

        // TV
        if (/https:\/\/www.instagram\.com\/tv\/[^/]*\/(\?.*)*$/.test(this.url)) {
            this.emit('tv');
        }

        // Saved
        if (/https:\/\/www\.instagram\.com\/[^/]*\/saved\/(\?.*)*$/.test(this.url)) {
            this.emit('saved');
        }

        // Tagged
        if (/https:\/\/www\.instagram\.com\/[^/]*\/tagged\/(\?.*)*$/.test(this.url)) {
            this.emit('tagged');
        }

        // Account
        if (/https:\/\/www\.instagram\.com\/[^/]*\/(\?.*)*$/.test(this.url)) {
            this.emit('account');
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
