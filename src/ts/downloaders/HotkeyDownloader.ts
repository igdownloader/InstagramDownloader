/****************************************************************************************
 * Copyright (c) 2022. HuiiBuh                                                          *
 * This file (HotkeyDownloader.ts) is part of InstagramDownloader which is not released *
 * under any licence.                                                                   *
 * Any usage of this code outside this project is not allowed.                          *
 ****************************************************************************************/
import { browser } from 'webextension-polyfill-ts';
import { Alert } from '../components/Alert';
import { Modal } from '../components/Modal';
import { LogClassErrors } from '../decorators';
import { URLChangeEmitter } from '../helper-classes/URLChangeEmitter';
import { QuerySelectors } from '../QuerySelectors';
import { PostDownloader } from './PostDownloader';
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

        if (key === 'd' && event.shiftKey && event.ctrlKey) {
            event.preventDefault();
            event.stopPropagation();

            if (URLChangeEmitter.isPost(location.href)) {
                await this.savePost();
            } else if (URLChangeEmitter.isStory(location.href)) {
                await StoryDownloader.downloadContent(event);
            }
        } else if (key === 'd' && event.shiftKey) {
            // tslint:disable-next-line:radix
            let shortcutReminder = localStorage.getItem('new_shortcut') ? parseInt(localStorage.getItem('new_shortcut')!) : 0;
            if (shortcutReminder < 5) {
                shortcutReminder += 1;
                localStorage.setItem('new_shortcut', shortcutReminder.toString());
                Alert.createAndAdd('The new hotkey for saving images and videos is `ctrl + shift + d`');
            }
        } else if (key === 's' && event.ctrlKey) {
            Alert.createAndAdd('The new hotkey for saving images and videos is `ctrl + shift + d`');
        }
    }

    public init(): void {
        document.addEventListener('keydown', this.hotKeyListener);
    }

    public remove(): void {
        document.removeEventListener('keydown', this.hotKeyListener);
    }

    private savePost(): void {
        const post = document.querySelector(QuerySelectors.postWrapper) as HTMLElement | null;
        post && PostDownloader.downloadContent(post);
    }
}
