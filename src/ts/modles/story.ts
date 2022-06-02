/****************************************************************************************
 * Copyright (c) 2022. HuiiBuh                                                          *
 * This file (story.ts) is part of InstagramDownloader which is not released            *
 * under any licence.                                                                   *
 * Any usage of this code outside this project is not allowed.                          *
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
