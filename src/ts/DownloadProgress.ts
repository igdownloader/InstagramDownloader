/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (DownloadProgress.ts) is part of InstagramDownloader which is released under
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/
import { browser } from 'webextension-polyfill-ts';
import { Alert } from './components/Alert';
import { DownloadProgress } from './modles/extension';

export class BackgroundDownloadProgress {
    private progressElement!: HTMLElement;
    private inProgress = false;

    public init(): void {
        browser.runtime.onMessage.addListener((download: DownloadProgress) => this.updateProgress(download));
        this.progressElement = Alert.create('', 'default', false);
    }

    /**
     * Update the progress of the download display element
     */
    private async updateProgress(download: DownloadProgress): Promise<void> {

        // Add the message button
        if (download.isFirst) {
            this.inProgress = true;
            await Alert.add(this.progressElement, null);
        }

        const text = `${download.type === 'download' ? 'Downloading' : 'Compression'} progress at ${download.percent}%`;

        // Remove the message button and set the progress to false
        if (download.isLast && this.inProgress) {
            this.inProgress = false;
            (this.progressElement.querySelector('.alert-message') as HTMLElement).innerText = text;
            await Alert.remove(this.progressElement);
            if (download.type === 'compression') {
                await Alert.createAndAdd('Bulk download finished');
            }
        }

        // Prevent async messages which arrive after the last message to change the number
        if (this.inProgress) {
            (this.progressElement.querySelector('.alert-message') as HTMLElement).innerText = text;
        }
    }
}
