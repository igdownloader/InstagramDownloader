/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (changelog.ts) is part of InstagramDownloader which is released under      *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

export interface BulletPoint {
    text: string;
    link: string;
}

interface Version {
    Fixes?: (BulletPoint | string)[]
    New?: (BulletPoint | string)[]
}

export type Changelog = Record<string, Version>

export const changeLog: Changelog = {
    '4.2.1': {
        'New': ['Automated the build even more. Now building with --watch is working'],
        'Fixes': [{
            link: 'https://github.com/HuiiBuh/InstagramDownloader/issues/134',
            text: 'Download button not appearing on multi image posts',
        }, {
            link: 'https://github.com/HuiiBuh/InstagramDownloader/issues/130',
            text: 'Continually tries to download "Download All" bulk zip file',
        }, "Use the linux zipping util for building in prod, so the zip can be used for uploading to the chrome store"],
    },
    '4.2.0': {
        'New': ['See the progress of the download and the compression progress', 'Added easter egg on the changelog page'],
        'Fixes': [{
            text: 'Preserve original file name #125',
            link: 'https://github.com/HuiiBuh/InstagramDownloader/issues/125',
        }, {
            text: 'Fixed story download resolution #123',
            link: 'https://github.com/HuiiBuh/InstagramDownloader/issues/123',
        }, {
            text: 'Increased account image resolution #123',
            link: 'https://github.com/HuiiBuh/InstagramDownloader/issues/123',
        }],
    },
    '4.1.1': {
        'Fixes': ['Changed paypal link so paypal does not keep 40%'],
    }, '4.0.0': {
        'Fixes': [{
            text: 'Download all button stays on top of the page #105',
            link: 'https://github.com/HuiiBuh/InstagramDownloader/issues/105',
        }, {
            text: 'Customize scroll interval #106',
            link: 'https://github.com/HuiiBuh/InstagramDownloader/issues/106',
        }, {
            text: 'Dowwnload correct story image #108',
            link: 'https://github.com/HuiiBuh/InstagramDownloader/issues/108',
        }, {
            text: 'Fix video download #109',
            link: 'https://github.com/HuiiBuh/InstagramDownloader/issues/109',
        },
            'Removed lots of unnecessary code',
        ],
        'New': [
            'See the progress of you background downloads',
            'Download button moves down when you scroll, so you can start the download from everywhere',
            'Customize the download speed', 'Source Code bundling with Webpack',
        ],
    },
    '3.4.1': {
        'Fixes': [
            'Download all button not appearing',
        ],
        'New': [
            'Download all button on saved page',
        ],
    },
};
