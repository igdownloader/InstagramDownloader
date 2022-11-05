/****************************************************************************************
 * Copyright (c) 2022. HuiiBuh                                                          *
 * This file (functions.ts) is part of InstagramDownloader which is not released        *
 * under any licence.                                                                   *
 * Any usage of this code outside this project is not allowed.                          *
 ****************************************************************************************/

import { LoggingLevel } from './models/extension';

/**
 * Sleep
 * @param ms How long the program should pause
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if the string is a valid url
 * @param urlString The string that should be checked
 */
export function validURL(urlString: string): boolean {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

    return pattern.test(urlString);
}

// tslint:disable-next-line:no-any
export function log(message: any[] | any, level: LoggingLevel = LoggingLevel.default): void {
    if (PRODUCTION) return;

    let logMessage = message;
    if (!Array.isArray(message)) {
        logMessage = [message];
    }

    if (level === LoggingLevel.default) {
        console.log(...logMessage);
    } else if (level === LoggingLevel.warn) {
        console.warn(...logMessage);
    } else {
        console.error(...logMessage);
    }

}

export const shortcodeToDateString = (shortcode: string): string =>
    instaIDToTimestamp(
        shortcodeToInstaID(shortcode),
    );

export const shortcodeToInstaID = (shortcode: string): string => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

    let mediaID = BigInt(0);
    for (const letter of shortcode) {
        mediaID = (mediaID * BigInt(64)) + BigInt(alphabet.charCodeAt(parseInt(letter, 0)));
    }

    return mediaID.toString();
};

export const instaIDToTimestamp = (id: string) => {
    const timestamp = (Number(id) / Math.pow(2, 23)) + 1314220021721;

    return new Date(timestamp).toLocaleString();
};
