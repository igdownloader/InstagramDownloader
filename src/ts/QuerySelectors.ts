/****************************************************************************************
 * Copyright (c) 2022. HuiiBuh                                                          *
 * This file (QuerySelectors.ts) is part of InstagramDownloader which is not released   *
 * under any licence.                                                                   *
 * Any usage of this code outside this project is not allowed.                          *
 ****************************************************************************************/

/**
 * A bunch of css selectors which get used by instagram
 */

export enum QuerySelectors {
    // Post
    postWrapper = '.M9sTE, .NI8nC, article._aalr',
    postBookmark = '.wmtNn, ._aamz > div',
    postLink = '.c-Yi7, ._aat8 a',
    postSliderIndicator = '.JSZAJ, .ijCUd',
    postSliderActive = '.XCodT',

    // Story
    storyAccountName = "._ac0q > .oajrlxb2",
    storyImage = '.y-yJ5, img._aa63',
    storyCloseButton = '.K_10X, ._g3zU, .aUIsh, ._ac0g>._abl-',

    // Account, Hover, Explore, Reels
    imagePreview = '._bz0w, .pKKVh, .Tjpra > a',
    accountImage = '._aarf._aarg  ._aa8j',
    accountName = '._7UhW9.fKFbl.yUEEX.KV-D4.fDxYl, ._aacl._aacs._aact._aacx._aada',
    topRightIconRow = '._47KiJ, .r9-Os, .J5g42',

    // Account Image
    accountImageWrapper = '.RR-M-, .M-jxE, ._aarf._aarg',

    // Bulk download
    loadingButton = '.By4nA',
    stopDownload = '._0mzm-.sqdOP.yWX7d',
}
