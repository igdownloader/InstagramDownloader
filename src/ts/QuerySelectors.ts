/****************************************************************************************
 * Copyright (c) 2021. HuiiBuh                                                          *
 * This file (QuerySelectors.ts) is part of InstagramDownloader which is released under *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

/**
 * A bunch of css selectors which get used by instagram
 */

export enum QuerySelectors {
    // Post
    postWrapper = '.M9sTE, .NI8nC',
    postBookmark = '.wmtNn',
    postLink = '.c-Yi7',
    postSliderIndicator = '.JSZAJ, .ijCUd',
    postSliderActive = '.XCodT',

    // Story
    storyImage = '.y-yJ5',
    storyCloseButton = '.K_10X, ._g3zU, .aUIsh',

    // Account, Hover, Explore, Reels
    imagePreview = '._bz0w, .pKKVh, .Tjpra > a',
    accountName = '._7UhW9.fKFbl.yUEEX.KV-D4.fDxYl',
    topRightIconRow = '._47KiJ, .r9-Os',

    // Account Image
    accountImageWrapper = '.RR-M-, .M-jxE',

    // Bulk download
    loadingButton = '.By4nA',
    stopDownload = '._0mzm-.sqdOP.yWX7d',
}
