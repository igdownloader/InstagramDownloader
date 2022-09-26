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
    postWrapper = '.M9sTE, .NI8nC, article._aalr, article._aa6a, article._aatb, article._ab0-, article._ab6k',
    postBookmark = '.wmtNn, ._aamz > div',
    postSliderBubble = '.JSZAJ, .ijCUd, ._acnb',
    postAccountName = "._aacl > ._aap6 > .oajrlxb2, ._acan._acao._acat._acaw",
    postSliderBubbleActive = '.XCodT, ._acnb._acnf',
    sliderItem = "._acaz",
    postContentWrapper = "._aatk._aatl, ._aatk._aatn, ._aato._ab1k._ab1l, ._aagu._ab64 ._aagv",

    // Story
    storyImage = '.y-yJ5, img._aa63',
    storyCloseButton = '.K_10X, ._g3zU, .aUIsh, ._ac0g>._abl-',
    storyAccountName = '._a3gq ._ac0q a, ._ac0q a',

    // Account, Hover, Explore, Reels
    accountImage = '._aarf._aarg  ._aa8j, ._aa_j ._aarf ._aa8h ._aa8j',
    accountName = '._7UhW9.fKFbl.yUEEX.KV-D4.fDxYl, ._aacl._aacs._aact._aacx._aada, ._acan._acao._acat._acaw',

    // Account Image
    accountImageWrapper = '.RR-M-, .M-jxE, ._aarf._aarg, ._aarf ._aa8h',
}
