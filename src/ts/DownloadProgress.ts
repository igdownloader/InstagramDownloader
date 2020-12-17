/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (DownloadProgress.ts) is part of InstagramDownloader which is released under
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/
import { browser } from 'webextension-polyfill-ts';
import { sleep } from './functions';
import { DownloadProgress } from './modles/messages';

export class BackgroundDownloadProgress {
    private progressElement: HTMLDivElement;
    private inDOM: boolean = false;

    public constructor() {
        this.progressElement = this.createProgressElement();
    }

    public init(): void {
        browser.runtime.onMessage.addListener((m: DownloadProgress) => {
            this.updateProgress(m);
        });
    }

    private async updateProgress(data: DownloadProgress): Promise<void> {
        if (data.finished) {
            await sleep(1000);
            try {
                this.progressElement.remove();
            } catch (_) {
                // Could not remove
            }
            this.inDOM = false;

            return;
        }

        console.log(data);

        if (!this.inDOM) document.body.appendChild(this.progressElement);
        this.inDOM = true;

        const progress = this.progressElement.querySelector('#progress') as HTMLElement;
        progress.innerText = `Downloaded ${data.progress} of ${data.total} media files`;
    }

    private createProgressElement(): HTMLDivElement {
        return document.createElement('div');
    }
}
