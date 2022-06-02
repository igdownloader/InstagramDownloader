/****************************************************************************************
 * Copyright (c) 2022. HuiiBuh                                                          *
 * This file (ForegroundMessageHandler.ts) is part of InstagramDownloader which is not released
 * under any licence.                                                                   *
 * Any usage of this code outside this project is not allowed.                          *
 ****************************************************************************************/
import { browser } from 'webextension-polyfill-ts';
import { Alert } from './components/Alert';
import { AlertMessage, DownloadProgress } from './modles/extension';
import { isDownloadProgress } from './modles/typeguards';

export class ForegroundMessageHandler {
    private progressElement!: HTMLElement;
    private inProgress = false;

    private static displayAlert({text, type = 'default', timeout = 5000, dismissible = true}: AlertMessage): void {
        Alert.createAndAdd(text, type, dismissible, timeout);
    }

    public init(): void {
        browser.runtime.onMessage.addListener((message: DownloadProgress |  AlertMessage) => {
            if (isDownloadProgress(message)) {
                this.updateProgress(message);
            } else {
                ForegroundMessageHandler.displayAlert(message);
            }
        });
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
