/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (download-functions.ts) is part of InstagramDownloader which is released under      *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import { GraphqlQuery, ShortcodeMedia } from '../modles/instagram';
import { ContentResponse } from '../modles/messages';
import { Variables } from '../Variables';

/**
 * Get the media file links for a post
 * @param contentURL The post URL
 * @param index null for every media, -1 for the image in case of a GraphSidecar any other index for the index of the GraphSidecar
 */
export async function getMedia(contentURL: string, index: number | null = null): Promise<ContentResponse> {
    const response = (await (await fetch(`${contentURL}?__a=1`)).json() as GraphqlQuery).graphql.shortcode_media;

    return {
        mediaURL: extractImage(response, index),
        accountName: extractAccountName(response),
        original: response,
    };
}

function extractImage(shortcodeMedia: ShortcodeMedia, index: number | null = null): string[] {
    let mediaURL: string[];
    if (shortcodeMedia.__typename === 'GraphImage') {
        mediaURL = [shortcodeMedia.display_url];
    } else if (shortcodeMedia.__typename === 'GraphVideo') {
        mediaURL = [shortcodeMedia.video_url];
    } else if (index === -1) {
        mediaURL = [shortcodeMedia.display_url];
    } else if (index === null) {
        mediaURL = [];
        for (const i of Array(shortcodeMedia.edge_sidecar_to_children.edges.length).keys()) {
            mediaURL.push(
                extractImage(shortcodeMedia, i)[0],
            );
        }
    } else {
        mediaURL = extractImage(shortcodeMedia.edge_sidecar_to_children.edges[index].node as ShortcodeMedia);
    }

    return mediaURL;
}

/**
 * Extract the account name of an API response
 */
export function extractAccountName(shortcodeMedia: ShortcodeMedia): string {
    return shortcodeMedia.owner.username;
}

/**
 * Get the current index of a slider
 * @param element The element the slider is in
 */
export function getSliderIndex(element: HTMLElement): number {
    const sliderIndicator = element.querySelector(Variables.postSliderIndicator);
    if (!sliderIndicator) return -1;

    const children = [...sliderIndicator.childNodes] as HTMLElement[];
    const activeElement = sliderIndicator.querySelector(Variables.postSliderActive)!;

    return children.findIndex(e => e === activeElement);
}

/**
 * Checks if the user is at the bottom of a page
 */
export function atBottom(): boolean {
    const offset = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const pageHeight = document.body.scrollHeight;

    return (offset + windowHeight + 100) > pageHeight;
}
