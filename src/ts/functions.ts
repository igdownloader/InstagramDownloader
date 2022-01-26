/****************************************************************************************
 * Copyright (c) 2021. HuiiBuh                                                          *
 * This file (functions.ts) is part of InstagramDownloader which is released under      *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import { LoggingLevel } from './modles/extension';

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
    const c_tri = 1000000000000;
    let id_tri = 0;
    let id_num = 0;
    for (const char of shortcode) {
        id_tri *= 64;
        id_num = (id_num * 64) + alphabet.indexOf(char);
        if (id_num >= c_tri) {
            let quot = Math.floor(id_num / c_tri);
            id_tri += quot;
            id_num -= quot * c_tri;
        }
    }
    return (id_tri.toString() + id_num.toString().padStart(c_tri.toString().length - 1, '0')).replace(/^0+/, "");
};

export const instaIDToTimestamp = (id: string) => {
    const timestamp = (Number(id) / Math.pow(2, 23)) + 1314220021721;

    return new Date(timestamp).toLocaleString();
};
