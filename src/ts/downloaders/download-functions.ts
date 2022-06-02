/****************************************************************************************
 * Copyright (c) 2022. HuiiBuh                                                          *
 * This file (download-functions.ts) is part of InstagramDownloader which is not released
 * under any licence.                                                                   *
 * Any usage of this code outside this project is not allowed.                          *
 ****************************************************************************************/

import { QuerySelectors } from '../QuerySelectors';

const IS_FIREFOX = 'browser' in window;

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
