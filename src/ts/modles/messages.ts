/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (messages.ts) is part of InstagramDownloader which is released under       *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

export interface DownloadMessage {
    imageURL: string[];
    accountName: string;
    type: ContentType;
}

export interface BulkDownloadMessage {
    imageURL: string[];
    accountName: string;
    type: ContentType;
}

export enum ContentType {
    single,
    bulk
}

export interface Image {
    imageSRC: string;
    type: ContentType;
}
