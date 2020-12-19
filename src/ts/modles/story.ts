/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (story.ts) is part of InstagramDownloader which is released under          *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

export interface User {
    id: string;
    profile_pic_url: string;
    username: string;
}

export interface Highlight {
    id: number;
    title: string;
}

export interface StoryResponse {
    user: User;
    highlight: Highlight;
}
