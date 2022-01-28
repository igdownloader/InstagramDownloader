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
    /* Instagram changed the shortcode generation method at 2012-02-07
          2012-02-07T02:01:16.000Z --> o5H__
          2012-02-07T02:35:23.000Z --> GsBiMipBgr
       With a low margin of error, we can assume the change happened 2:30:00 GMT
       GsA6wzgAAA = 120475328165445632
    */
    if (shortcode.length < 10) return ''; // support new shortcode method only
    
    /* Private account shortcodes problem:
       - How many characters to extract from private account shortcode?
         Old method shortcode length is 1 until 5, new method length can be 10 or 11
    */
    if (shortcode.length > 11) return ''; // TODO: handle private account shortcodes

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const cMil = 1000000; // add 6 digits of precision to the Number max limit (safe at least until year 2290)
    let idMil = 0; // store numbers above 999999
    let idNum = 0; // store numbers below 1000000
    for (const char of shortcode) { // base64 to base10
        idMil *= 64;
        idNum = (idNum * 64) + alphabet.indexOf(char);
        if (idNum >= cMil) {
            let quot = Math.floor(idNum / cMil);
            idMil += quot;
            idNum -= quot * cMil;
        }
    }

    return (idMil.toString() + idNum.toString().padStart(cMil.toString().length - 1, '0')).replace(/^0+/, '');
};

export const instaIDToTimestamp = (id: string) => {
    const timestamp = (Number(id) / Math.pow(2, 23)) + 1314220021721;

    return new Date(timestamp).toLocaleString();
};
