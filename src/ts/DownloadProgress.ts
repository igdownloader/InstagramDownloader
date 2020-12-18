/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (DownloadProgress.ts) is part of InstagramDownloader which is released under
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/
import { browser } from 'webextension-polyfill-ts';
import { log, sleep } from './functions';
import { DownloadProgress } from './modles/messages';

export class BackgroundDownloadProgress {
    private progressElement: HTMLElement = BackgroundDownloadProgress.createProgressElement();
    private inProgress = false;

    private static createProgressElement(): HTMLElement {
        const element = document.createElement('button');
        element.classList.add('large-button', 'top', 'left');
        element.style.zIndex = '10';

        return element;
    }

    public init(): void {
        browser.runtime.onMessage.addListener((download: DownloadProgress) => {
            log(download);
            this.updateProgress(download);
        });
    }

    /**
     * Update the progress of the download display element
     */
    private updateProgress(download: DownloadProgress): void {
        if (download.first) {
            this.inProgress = true;
            document.body.querySelector('div')!.appendChild(this.progressElement);
        }

        if (download.last) {
            this.inProgress = false;
            this.progressElement.innerText = `Downloaded ${download.progress} of ${download.total} media files \n SUCCESS`;

            return this.removeElement();
        }

        // Prevent async messages which arrive after the last message to change the number
        if (this.inProgress) {
            this.progressElement.textContent = `Downloaded ${download.progress} of ${download.total} media files`;
        }
    }

    private removeElement(): void {
        sleep(5000).then(() => {
            this.progressElement.remove();
        });
    }
}
