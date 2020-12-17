/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (HotkeyDownloader.ts) is part of InstagramDownloader which is released under
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/
import { browser } from 'webextension-polyfill-ts';
import { Modal } from '../helper-classes/Modal';
import { ShortcodeMedia } from '../modles/instagram';
import { DownloadMessage, DownloadType } from '../modles/messages';
import { Variables } from '../Variables';
import { getMedia } from './download-functions';

export class HotkeyDownloader {

    private readonly hotKeyListener: (e: KeyboardEvent) => void;
    private modal: Modal;

    public constructor() {
        this.hotKeyListener = this.keyPressed.bind(this);

        const imageURL = browser.runtime.getURL('icons/instagram.png');
        this.modal = new Modal({
                heading: 'Download started',
                imageURL,
                buttonList: [{
                    text: 'Close',
                    active: true,
                }],
                content: ['If you have a lot of videos the download can take a longer time'],
            },
        );
    }

    public async keyPressed(event: KeyboardEvent): Promise<void> {
        const key: string = event.key.toLowerCase();

        if (key === 's' && event.ctrlKey) {
            event.preventDefault();
            event.stopPropagation();

            if (/https:\/\/www.instagram.com\/p\/[^/]*\/(\?.*)*$/.test(location.href)) {
                await this.savePost();
            } else {
                await this.saveStory();
            }

        }
    }

    public init(): void {
        document.addEventListener('keydown', this.hotKeyListener);
    }

    public remove(): void {
        document.removeEventListener('keydown', this.hotKeyListener);
    }

    private async savePost(): Promise<void> {
        const response = await getMedia(location.href);

        const downloadType = response.mediaURL.length > 1 ? DownloadType.bulk : DownloadType.single;

        const downloadMessage: DownloadMessage = {
            imageURL: response.mediaURL,
            type: downloadType,
            accountName: response.accountName,
        };

        await browser.runtime.sendMessage(downloadMessage);

        if (downloadMessage.type === DownloadType.bulk) {
            await this.modal.open();
        }
    }

    private async saveStory(): Promise<void> {
        const video = document.getElementsByTagName('source')[0];
        const img = document.getElementsByClassName(Variables.storyImageClass)[0] as HTMLImageElement;

        let url: string = '';
        if (typeof video !== 'undefined') {
            url = video.src;
        } else if (typeof img !== 'undefined') {
            url = img.src;
        }

        const requestURL: string = location.href + '?__a=1';
        const accountName = await this.makeAPIRequest(requestURL) as string;

        const downloadMessage: DownloadMessage = {
            imageURL: [url],
            accountName,
            type: DownloadType.single,
        };
        await browser.runtime.sendMessage(downloadMessage);
    }

    /**
     * Make a api request which returns the response to this request
     * @param requestURL The url the request should be made to
     */
    private async makeAPIRequest(requestURL: string): Promise<ShortcodeMedia | string> {
        return new Promise<ShortcodeMedia | string>(((resolve, reject) => {

                const apiRequest: XMLHttpRequest = new XMLHttpRequest();

                apiRequest.onreadystatechange = function(): void {
                    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                        const response = JSON.parse(this.responseText);
                        try {
                            resolve(response.graphql.shortcode_media);
                        } catch {
                            resolve(response.user.username);
                        }
                    } else if (this.readyState === XMLHttpRequest.DONE) {
                        reject(new Error('Could not connect to the instagram API.'));
                    }
                };
                apiRequest.open('GET', requestURL);
                apiRequest.send();
            }),
        );
    }

}
