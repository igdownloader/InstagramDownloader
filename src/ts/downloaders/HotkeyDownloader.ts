/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (HotkeyDownloader.ts) is part of InstagramDownloader which is released under
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/
import { browser } from 'webextension-polyfill-ts';
import { Modal } from '../components/Modal';
import { LogClassErrors } from '../decorators';
import { URLChangeEmitter } from '../helper-classes/URLChangeEmitter';
import { DownloadMessage, DownloadType } from '../modles/extension';
import { getMedia } from './download-functions';
import { StoryDownloader } from './StoryDownloader';

@LogClassErrors
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

            if (URLChangeEmitter.isPost(location.href)) {
                await this.savePost();
            } else {
                await StoryDownloader.downloadContent(event);
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
}
