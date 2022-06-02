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
export function getSliderIndex(element: HTMLElement): { index: number; isLast: boolean } {
    const sliderIndicator = [...element.querySelectorAll(QuerySelectors.postSliderBubble)];
    const activeElement = element.querySelector(QuerySelectors.postSliderBubbleActive)!;

    const index = sliderIndicator.findIndex(e => e === activeElement);
    return {
        index,
        isLast: index === sliderIndicator.length - 1,
    };
}

/**
 * Get the highest resolution src from a srcSet String
 */
export function extractSrcSet(img: HTMLImageElement): string {

    const getSrcSet = (srcSet: string): { res: number; url: string } | undefined => {
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
        const url = getSrcSet(img.srcset + `,${img.src} ${img.width}w`)?.url;
        if (typeof url !== 'string') {
            return img.src;
        }
        // tslint:disable-next-line:no-unused-expression Check if url
        new URL(url);
        return url;
    } catch {
        return img.src;
    }
}
