/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (DownloadProgress.ts) is part of InstagramDownloader which is released under
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/
import { browser } from 'webextension-polyfill-ts';
import { log } from './functions';
import { DownloadProgress } from './modles/extension';

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

        // Add the message button
        if (download.isFirst) {
            this.inProgress = true;
            document.body.querySelector('div')!.appendChild(this.progressElement);
        }

        const text = `${download.type === 'download' ? 'Downloading' : 'Compression'} progress at ${download.percent}%`;

        // Remove the message button and set the progress to false
        if (download.isLast) {
            this.inProgress = false;
            this.progressElement.innerText = text;
            this.progressElement.remove();
        }

        // Prevent async messages which arrive after the last message to change the number
        if (this.inProgress) this.progressElement.textContent = text;
    }
}
