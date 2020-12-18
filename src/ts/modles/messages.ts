/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (messages.ts) is part of InstagramDownloader which is released under       *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/
import { ShortcodeMedia } from './instagram';

export interface DownloadMessage {
    imageURL: string[];
    accountName: string;
    type: DownloadType;
}

export enum DownloadType {
    single,
    bulk
}

export interface ContentResponse {
    accountName: string;
    mediaURL: string[];
    original: ShortcodeMedia
}

export interface DownloadProgress {
    last: boolean;
    first: boolean;
    progress: number;
    total: number;
}

export enum LoggingLevel {
    default = 'log',
    warn = 'warn',
    error = 'error',
}
