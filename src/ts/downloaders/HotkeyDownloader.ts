/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (HotkeyDownloader.ts) is part of InstagramDownloader which is released under
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/
import {Variables} from '../Variables';
import {Modal, ModalButton} from '../Modal';
import {browser} from 'webextension-polyfill-ts';
import {ContentType, DownloadMessage} from '../modles/messages';
import {Edge, ShortcodeMedia} from '../modles/instagram';

export class HotkeyDownloader {

    private readonly hotKeyListener: (e:KeyboardEvent) => void;
    private modal: Modal;

    constructor() {
        this.hotKeyListener = this.hotKey.bind(this);

        const button: ModalButton = {
            text: 'Close',
            callback: this.closeModal.bind(this),
            active: true,
        };
        const imageURL = browser.runtime.getURL('icons/instagram.png');
        this.modal = new Modal('Download started', ['The download continues in the background.',
            'If you have a lot of videos the download can take a longer time'], [button], imageURL);
    }


    private static getType(response: ShortcodeMedia): ContentType {
        if (response.__typename === 'GraphSidecar') {
            return ContentType.bulk;
        }
        return ContentType.single;
    }

    private closeModal(): void {
        this.modal.hideModal();
    }

    async hotKey(event: KeyboardEvent): Promise<void> {
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

    init(): void {
        document.addEventListener('keydown', this.hotKeyListener);
    }

    remove(): void {
        document.removeEventListener('keydown', this.hotKeyListener);
    }

    private async savePost(): Promise<void> {
        const requestURL: string = location.href + '?__a=1';
        const response: ShortcodeMedia = await this.makeAPIRequest(requestURL);


        const links: string[] = this.extractLinks(response);
        const type: ContentType = HotkeyDownloader.getType(response);
        const accountName: string = this.getAccountName(response);
        const downloadMessage: DownloadMessage = {
            imageURL: links,
            type,
            accountName,
        };

        if (downloadMessage.type === ContentType.bulk) {
            this.modal.showModal();
        }

        browser.runtime.sendMessage(downloadMessage);
    }

    /**
     * Extract the links form the instagram api response and return the links as list
     * @param response The instagram api response
     * @returns The image and video links in a list
     */
    private extractLinks(response: ShortcodeMedia): string[] {
        if (response.__typename === 'GraphVideo') {
            return [response.video_url];
        } else if (response.__typename === 'GraphSidecar') {
            const contentList: string[] = [];

            response.edge_sidecar_to_children.edges.forEach((image: Edge) => {
                if (image.node.__typename === 'GraphVideo') {
                    contentList.push(image.node.video_url);
                } else {
                    contentList.push(image.node.display_url);
                }
            });
            return contentList;
        } else {
            return [response.display_url];
        }
    }

    /**
     * Get the account name with the api response
     * @param response The instagram api response
     */
    getAccountName(response: any): string {
        try {
            return response.owner.username;
        } catch {
            return '';
        }
    }

    /**
     * Make a api request which returns the response to this request
     * @param requestURL The url the request should be made to
     */
    private async makeAPIRequest(requestURL: string): Promise<any> {
        return new Promise<object>(((resolve, reject) => {

                const apiRequest: XMLHttpRequest = new XMLHttpRequest();

                apiRequest.onreadystatechange = function (): void {
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

    private async saveStory(): Promise<void> {
        const video = document.getElementsByTagName('source')[0];
        const img = document.getElementsByClassName(Variables.storyImageClass)[0] as HTMLImageElement;

        let url: string = "";
        if (typeof video !== 'undefined') {
            url = video.src;
        } else if (typeof img !== 'undefined') {
            url = img.src;
        }

        const requestURL: string = location.href + '?__a=1';
        const accountName = await this.makeAPIRequest(requestURL);

        const downloadMessage: DownloadMessage = {
            imageURL: [url],
            accountName,
            type: ContentType.single,
        };
        browser.runtime.sendMessage(downloadMessage);
    }
}
