/****************************************************************************************
 * Copyright (c) 2022. HuiiBuh                                                          *
 * This file (HotkeyDownloader.ts) is part of InstagramDownloader which is not released *
 * under any licence.                                                                   *
 * Any usage of this code outside this project is not allowed.                          *
 ****************************************************************************************/
import { Alert } from '../components/Alert';
import { LogClassErrors } from '../decorators';
import { URLChangeEmitter } from '../helper-classes/URLChangeEmitter';
import { QuerySelectors } from '../QuerySelectors';
import { PostDownloader } from './PostDownloader';
import { StoryDownloader } from './StoryDownloader';

@LogClassErrors
export class HotkeyDownloader {

    private readonly hotKeyListener: (e: KeyboardEvent) => void;

    public constructor() {
        this.hotKeyListener = this.keyPressed.bind(this);
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
