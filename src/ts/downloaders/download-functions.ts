/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (download-functions.ts) is part of InstagramDownloader which is released under      *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import { ContentResponse } from '../modles/extension';
import { GraphqlQuery, ShortcodeMedia } from '../modles/post';
import { StoryResponse } from '../modles/story';
import { Variables } from '../Variables';

/**
 * Get the media file links for a post
 * @param contentURL The post URL
 * @param index null for every media, -1 for the image in case of a GraphSidecar any other index for the index of the GraphSidecar
 */
export async function getMedia(contentURL: string, index: number | null = null): Promise<ContentResponse> {
    const response = await makeRequest(contentURL);

    return {
        mediaURL: extractImage(response, index),
        accountName: extractAccountName(response),
        original: response,
    };
}

/**
 * Make a request to the instagram API and return the result
 * @param contentURL The api url to query
 */
export async function makeRequest(contentURL: string): Promise<ShortcodeMedia> {
    return (await (await fetch(`${contentURL}?__a=1`)).json() as GraphqlQuery).graphql.shortcode_media;
}

/**
 * Get the account name of a specific API url
 * @param contentURL The api url to query
 */
export async function getStoryAccountName(contentURL: string): Promise<string> {
    const response = (await (await fetch(`${contentURL}?__a=1`)).json() as StoryResponse);

    return response.user.username;
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

/**
 * Get the highest resolution src from a srcSet String
 */
export function extractSrcSet(srcSet: string): string {

    const srcSetList: { res: number; url: string }[] = [];
    srcSet.split(',').forEach(set => {
        const [url, resolution] = (set.split(' ') as [string, string]);
        srcSetList.push({
            res: parseInt(resolution.replace('w', ''), 0),
            url,
        });
        srcSetList.sort((a, b) => b.res - a.res);
    });

    return srcSetList[0].url;
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
