/****************************************************************************************
 * Copyright (c) 2021. HuiiBuh                                                          *
 * This file (download-functions.ts) is part of InstagramDownloader which is released under
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import { LogIGRequest } from '../decorators';
import { ContentResponse } from '../modles/extension';
import { GraphqlQuery, ShortcodeMedia, PostQuery, PostItem } from '../modles/post';
import { StoryResponse } from '../modles/story';
import { QuerySelectors } from '../QuerySelectors';

const IS_FIREFOX = 'browser' in window;

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

export const downloadFile = (downloadUrl: string, progress: ((this: XMLHttpRequest, ev: ProgressEvent) => void) | null = null) =>
    new Promise<Blob>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', downloadUrl);
        if (IS_FIREFOX) {
            xhr.setRequestHeader('User-Agent', 'curl/7.64.1');
        }

        xhr.onprogress = progress;

        xhr.onload = function(): void {
            if (xhr.status !== 200) return;
            const blob: Blob = this.response;
            resolve(blob);
        };

        xhr.onerror = reject;
        xhr.responseType = 'blob';
        xhr.send();
    });

/**
 * Make a request to the instagram API and return the result
 * @param contentURL The api url to query
 */
export const makeRequest = LogIGRequest(async (contentURL: string): Promise<PostItem | ShortcodeMedia> => {
    const response = await (await fetch(`${contentURL}?__a=1`)).json();
    const postResponse = response as PostQuery; 
    const graphqlResponse = response as GraphqlQuery; 
    if (graphqlResponse.graphql) {
        return graphqlResponse.graphql.shortcode_media;
    } else {
        return postResponse.items[0];
    }
})

/**
 * Make a request to the instagram API and return the result
 * @param contentURL The api url to query
 */
export const makeAccountRequest = LogIGRequest(async (contentURL: string): Promise<{ profile_pic_url_hd: string; username: string }> =>
    (await (await fetch(`${contentURL}?__a=1`)).json()).graphql.user);

/**
 * Get the account name of a specific API url
 * @param contentURL The api url to query
 */
export const getStoryAccountName = LogIGRequest(async (contentURL: string) =>
    (await (await fetch(`${contentURL}?__a=1`)).json() as StoryResponse).user.username);

/**
 * Extract the account name of an API response
 */
export function extractAccountName(shortcodeMedia: ShortcodeMedia | PostItem): string {
    const postItem = shortcodeMedia as PostItem; 
    const shortCodeMedia = shortcodeMedia as ShortcodeMedia; 
    const user = postItem.user || shortCodeMedia.owner;

    return user.username;
}

/**
 * Get the current index of a slider
 * @param element The element the slider is in
 */
export function getSliderIndex(element: HTMLElement): number {
    const sliderIndicator = element.querySelector(QuerySelectors.postSliderIndicator);
    if (!sliderIndicator) return -1;

    const children = [...sliderIndicator.childNodes] as HTMLElement[];
    const activeElement = sliderIndicator.querySelector(QuerySelectors.postSliderActive)!;

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
export function extractSrcSet(img: HTMLImageElement): string {

    const getSrcSet = (srcSet: string) => {
        const srcSetList: { res: number; url: string }[] = [];
        srcSet.split(',').forEach(set => {
            const [url, resolution] = (set.split(' ') as [string, string]);
            srcSetList.push({
                res: parseInt(resolution.replace('w', ''), 0),
                url,
            });
        });
        srcSetList.sort((a, b) => b.res - a.res);

        return srcSetList[0];
    };

    try {
        return getSrcSet(img.srcset + `,${img.src} ${img.width}w`).url;
    } catch {
        return img.src;
    }
}

function extractImage(shortcodeMedia: ShortcodeMedia | PostItem, index: number | null = null): string[] {
    let mediaURL: string[] = [];
    const shortCodeMedia = shortcodeMedia as ShortcodeMedia; 
    const postItem = shortcodeMedia as PostItem; 

    if (shortCodeMedia.__typename) {
        if (shortCodeMedia.__typename === 'GraphImage') {
            mediaURL = [shortCodeMedia.display_url];
        } else if (shortCodeMedia.__typename === 'GraphVideo') {
            mediaURL = [shortCodeMedia.video_url];
        } else if (index === -1) {
            mediaURL = [shortCodeMedia.display_url];
        } else if (index === null) {
            mediaURL = [];
            for (const i of Array(shortCodeMedia.edge_sidecar_to_children.edges.length).keys()) {
                mediaURL.push(
                    extractImage(shortcodeMedia, i)[0],
                );
            }
        } else {
            mediaURL = extractImage(shortCodeMedia.edge_sidecar_to_children.edges[index].node as ShortcodeMedia);
        }
    } else {
        index = index === -1 ? 0 : index;
        if (postItem.video_versions) {
            // Post is a video
            mediaURL =  [postItem.video_versions[0].url];
        }
        else if (postItem.image_versions2) {
            // Post is an image
            mediaURL = [postItem.image_versions2.candidates[0].url];
        } else {
            // Multiple posts are present and optionally uses an index
            //@ts-ignore postItem.carousel_media should never be undefined at this point 
            const urls = postItem.carousel_media.map(media => {
                const mediaObject = media.video_versions ? media.video_versions[0] : media.image_versions2.candidates[0];
                return mediaObject.url;
            });
            mediaURL = index ? [urls[index]] : urls;
        }
    }

    return mediaURL;
}
