'use strict';

/**
 * Subscribe to the emitter of this class to get the current instagram page
 */
class URLChangeEmitter {
    private url: string = location.href;

    // Nice working with stable software!
    // window.EventTarget workaround for addon + Inheritance not working
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1473306
    public emitter: EventTarget = new window.EventTarget();


    /**
     * Add a locationchange event dispatcher
     */
    constructor() {
        URLChangeEmitter.addLocationChangeListener();
        this.subscribeToLocationChangeListener();
    }

    /**
     * Add a replace state event listener
     * This fires a locationchange event from the windows element
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
            '    window.dispatchEvent(new Event(\'pushstate\'));' +
            '    window.dispatchEvent(new Event(\'locationchange\'));' +
            '    return ret;' +
            '})(history.pushState);' +
            '' +
            'history.replaceState = ( f => function replaceState(){' +
            '    var ret = f.apply(this, arguments);' +
            '    window.dispatchEvent(new Event(\'replacestate\'));' +
            '    window.dispatchEvent(new Event(\'locationchange\'));' +
            '    return ret;' +
            '})(history.replaceState);' +
            '' +
            'window.addEventListener(\'popstate\',()=>{' +
            '    window.dispatchEvent(new Event(\'locationchange\'))' +
            '});';
        head.appendChild(script);
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

    /**
     * Check the url and emit the right event
     */
    public emitLocationEvent(): void {

        // Home
        if (/^https:\/\/www.instagram.com\/(\?.*)*$/.test(this.url)) {
            this.emitter.dispatchEvent(new Event('home'));
        }

        // Post
        if (/https:\/\/www.instagram.com\/p\/[^/]*\/(\?.*)*$/.test(this.url)) {
            this.emitter.dispatchEvent(new Event('post'));
        }

        // Explore
        if (/https:\/\/www.instagram.com\/explore\/tags\/[^\/]*\/(\?.*)*$/.test(this.url)) {
            this.emitter.dispatchEvent(new Event('explore'));
        }

        // Story
        if (/https:\/\/www.instagram.com\/stories\/[^/]*\/[^/]*\/(\?.*)*$/.test(this.url) ||
            /https:\/\/www.instagram.com\/stories\/highlights\/[^/]*\/(\?.*)*$/.test(this.url)) {
            this.emitter.dispatchEvent(new Event('story'));
        }

        // Chanel
        if (/https:\/\/www.instagram.com\/[^/]*\/channel\/(\?.*)*$/.test(this.url)) {
            this.emitter.dispatchEvent(new Event('chanel'));
        }

        // TV
        if (/https:\/\/www.instagram.com\/tv\/[^/]*\/(\?.*)*$/.test(this.url)) {
            this.emitter.dispatchEvent(new Event('tv'));
        }

        // Saved
        if (/https:\/\/www.instagram.com\/[^/]*\/saved\/(\?.*)*$/.test(this.url)) {
            this.emitter.dispatchEvent(new Event('saved'));
        }

        // Tagged
        if (/https:\/\/www.instagram.com\/[^/]*\/tagged\/(\?.*)*$/.test(this.url)) {
            this.emitter.dispatchEvent(new Event('tagged'));
        }

        // Account
        if (/https:\/\/www.instagram.com\/[^/]*\/(\?.*)*$/.test(this.url)) {
            this.emitter.dispatchEvent(new Event('account'));
        }

    }
}
