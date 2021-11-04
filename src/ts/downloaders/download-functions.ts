/****************************************************************************************
 * Copyright (c) 2021. HuiiBuh                                                          *
 * This file (download-functions.ts) is part of InstagramDownloader which is released under
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import { LogIGRequest } from '../decorators';
import { ContentResponse } from '../modles/extension';
import { GraphqlQuery, PostItem, PostQuery, ShortcodeMedia } from '../modles/post';
import { StoryResponse } from '../modles/story';
import { QuerySelectors } from '../QuerySelectors';

const IS_FIREFOX = 'browser' in window;

const isShortcodeMedia = (media: ShortcodeMedia | PostItem): media is ShortcodeMedia => '__typename' in media;

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
        originalResponse: response,
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
    const response = await (await fetch(`${contentURL}?__a=1`)).json() as PostQuery | GraphqlQuery;
    if ('graphql' in response && response.graphql) {
        return response.graphql.shortcode_media;
    }

    return (response as PostQuery).items[0];
});

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
    const user = isShortcodeMedia(shortcodeMedia) ? shortcodeMedia.owner: shortcodeMedia.user

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
    let mediaURL: string[];

    if (isShortcodeMedia(shortcodeMedia)) {
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
    } else {
        const imageIndex = index === -1 ? 0 : index;
        if (shortcodeMedia.video_versions) {
            // Post is a video
            mediaURL = [shortcodeMedia.video_versions[0].url];
        } else if (shortcodeMedia.image_versions2) {
            // Post is an image
            mediaURL = [shortcodeMedia.image_versions2.candidates[0].url];
        } else {
            // Multiple posts are present and optionally uses an index
            const urls = shortcodeMedia.carousel_media!.map(media => {
                const mediaObject = media.video_versions ? media.video_versions[0] : media.image_versions2.candidates[0];

                return mediaObject.url;
            });
            mediaURL = imageIndex != null ? [urls[imageIndex]] : urls;
        }
    }

    return mediaURL;
}
