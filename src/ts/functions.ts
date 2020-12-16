/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (functions.ts) is part of InstagramDownloader which is released under      *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

import { GraphqlQuery, ShortcodeMedia } from './modles/instagram';
import { ContentResponse } from './modles/messages';
import { Variables } from './Variables';

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

export function insertAfter(newNode: HTMLElement, referenceNode: HTMLElement): void {
    referenceNode.parentNode!.insertBefore(newNode, referenceNode.nextSibling);
}

export async function getContentJSON(contentURL: string, index: number | null = null): Promise<ContentResponse> {
    const response = (await (await fetch(`${contentURL}?__a=1`)).json() as GraphqlQuery).graphql.shortcode_media;

    return extract(response);

    function extract(e: ShortcodeMedia): ContentResponse {
        let mediaURL;
        if (e.__typename === 'GraphImage') {
            mediaURL = e.display_url;
        } else if (e.__typename === 'GraphVideo') {
            mediaURL = e.video_url;
        } else if (index === -1 || index === null) {
            mediaURL = e.display_url;
        } else {
            mediaURL = extract(e.edge_sidecar_to_children.edges[index].node as ShortcodeMedia).mediaURL;
        }

        return {
            mediaURL,
            accountName: e.owner.username,
        };

    }
}

export function isPostSlider(element: HTMLElement): number {
    const sliderIndicator = element.querySelector(Variables.postSliderIndicator);
    if (!sliderIndicator) return -1;

    const children = [...sliderIndicator.childNodes] as HTMLElement[];
    const activeElement = sliderIndicator.querySelector(Variables.postSliderActive)!;

    return children.findIndex(e => e === activeElement);
}
