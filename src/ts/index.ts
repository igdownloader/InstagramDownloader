/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (index.ts) is part of InstagramDownloader which is released under           *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import { browser } from 'webextension-polyfill-ts';
import '../scss/main.scss';
import { singleton } from './decorators';
import { AccountImageDownloader } from './downloaders/AccountImageDownloader';
import { BulkDownloader } from './downloaders/BulkDownloader';
import { HotkeyDownloader } from './downloaders/HotkeyDownloader';
import { HoverDownloader } from './downloaders/HoverDownloader';
import { PostDownloader } from './downloaders/PostDownloader';
import { StoryDownloader } from './downloaders/StoryDownloader';
import { BackgroundDownloadProgress } from './DownloadProgress';
import { log } from './functions';
import { URLChangeEmitter } from './helper-classes/URLChangeEmitter';

/**
 * Create a new Addon manager (only once)
 */
@singleton
export class AddonManager {
    private urlChangeEmitter: URLChangeEmitter = new URLChangeEmitter();

    private postDownloader: PostDownloader = new PostDownloader();
    private storyDownloader: StoryDownloader = new StoryDownloader();
    private hoverDownloader: HoverDownloader = new HoverDownloader();
    private accountImageDownloader: AccountImageDownloader = new AccountImageDownloader();
    private bulkDownloader: BulkDownloader = new BulkDownloader();
    private hotkeyDownloader: HotkeyDownloader = new HotkeyDownloader();
    private downloadProgress: BackgroundDownloadProgress = new BackgroundDownloadProgress();

    /**
     * Create a new Addon manager. This class has to be constructed only once
     */
    public constructor() {
        AddonManager.addBackgroundVariable();
        AddonManager.adjustForAndroid();

        this.addListeners();
        this.urlChangeEmitter.emitLocationEvent();
    }

    /**
     * Check if the browser is mobile
     * @returns  Is Mobile
     */
    private static isMobile(): boolean {
        return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    }

    /**
     * Hide the hover icons if the mobile firefox is detected
     */
    private static adjustForAndroid(): void {
        if (AddonManager.isMobile()) {
            const style: HTMLStyleElement = document.createElement('style');
            style.innerText = '' +
                '.hover-download-button, .account-download-button {' +
                '    display: none!important;' +
                '}';
            document.head.appendChild(style);
        }
    }

    /**
     * Add the download image as css variable
     */
    private static addBackgroundVariable(): void {
        const downloadImageBlack = browser.runtime.getURL('icons/download_black.png');
        document.documentElement.style.setProperty('--extension-download-black', `url(${downloadImageBlack}`);

        const downloadImageWhite = browser.runtime.getURL('icons/download_white.png');
        document.documentElement.style.setProperty('--extension-download-white', `url(${downloadImageWhite}`);

        const instagramAddonImage = browser.runtime.getURL('icons/instagram.png');
        document.documentElement.style.setProperty('--extension-ig-icon', `url(${instagramAddonImage}`);

        const extensionCloseIcon = browser.runtime.getURL('icons/close_black_24dp.svg');
        document.documentElement.style.setProperty('--extension-close-icon', `url(${extensionCloseIcon}`);

    }

    /**
     * Add listeners for an url change
     */
    private addListeners(): void {
        this.downloadProgress.init();

        this.urlChangeEmitter.on('home', () => {
            log('home');
            this.removeEveryDownloader();
            this.postDownloader.init();
        });

        this.urlChangeEmitter.on('post', () => {
            log('post');
            this.removeEveryDownloader();
            this.postDownloader.init();
            this.hoverDownloader.init();
            this.hotkeyDownloader.init();
        });

        this.urlChangeEmitter.on('explore', () => {
            log('explore');
            this.hoverDownloader.init();
        });

        this.urlChangeEmitter.on('story', () => {
            log('story');
            this.removeEveryDownloader();
            this.storyDownloader.init();
            this.hotkeyDownloader.init();
        });

        this.urlChangeEmitter.on('channel', () => {
            log('channel');
            this.removeEveryDownloader();

            this.hoverDownloader.init();
            this.bulkDownloader.init();
            this.accountImageDownloader.init();
        });

        this.urlChangeEmitter.on('tv', () => {
            log('tv');
            this.removeEveryDownloader();

            this.postDownloader.init();
            this.accountImageDownloader.init();
        });

        this.urlChangeEmitter.on('saved', () => {
            log('saved');
            this.removeEveryDownloader();

            this.hoverDownloader.init();
            this.accountImageDownloader.init();
            this.bulkDownloader.init();
        });

        this.urlChangeEmitter.on('tagged', () => {
            log('tagged');
            this.removeEveryDownloader();

            this.hoverDownloader.init();
            this.accountImageDownloader.init();
            this.bulkDownloader.init();
        });

        this.urlChangeEmitter.on('account', () => {
            log('account');
            this.removeEveryDownloader();

            this.bulkDownloader.init();
            this.accountImageDownloader.init();
            this.hoverDownloader.init();
        });
        this.urlChangeEmitter.on('reels', () => {
            log('reels');
            this.removeEveryDownloader();

            this.bulkDownloader.init();
            this.accountImageDownloader.init();
            this.hoverDownloader.init();
        });

    }

    /**
     * Remove every downloader which might be active
     */
    private removeEveryDownloader(): void {
        this.storyDownloader.remove();
        this.postDownloader.remove();
        this.hoverDownloader.remove();
        this.bulkDownloader.remove();
        this.accountImageDownloader.remove();
        this.hotkeyDownloader.remove();
    }
}

// tslint:disable-next-line:no-unused-expression
new AddonManager();
