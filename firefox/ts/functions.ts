'use strict';

/**
 * Sleep
 * @param ms How long the program should pause
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

