/*
 * Copyright (c) 2020. HuiiBuh
 * This file (build.js) is part of InstagramDownloader which is released under
 * GNU LESSER GENERAL PUBLIC LICENSE.
 * You are not allowed to use this code or this file for another project without
 * linking to the original source AND open sourcing your code.
 */

const fs = require('fs');
const fse = require('fs-extra');
const exec = require('child_process').execSync;

const browserList = ["chrome", "firefox"];


(async function () {

    // Check if dir exists and create it otherwise
    if (!(await fs.existsSync('zip'))) {
        await fs.promises.mkdir('zip');
    }

    // Generate the extension for every browser
    for (const browser of browserList) {
        await assembleExtensionFiles(browser);
        await execute(`cd zip/${browser} && zip ../${browser}.zip * -r && cd ../..`);
    }

    await execute("git archive --format zip --output zip/InstagramDownloader.zip HEAD");
})();

/**
 * Collect all files necessary to build the extension
 * @param browser The browser
 */
async function assembleExtensionFiles(browser) {
    const path = `zip/${browser}`;
    if (await fs.existsSync(path)) {
        await fs.promises.rmdir(path, {recursive: true});
    }

    await fs.promises.mkdir(path);

    await fs.promises.copyFile(`src/manifest_${browser}.json`, `${path}/manifest.json`);
    await fse.copy("src/icons/", `${path}/icons`);
    await fse.copy("dist", path);
}


/**
 * Execute a command in the linux command line
 * @param command The command which should be executed
 */
function execute(command) {
    let response = "";
    try {
        response = exec(command, {encoding: "utf-8"});
    } catch (e) {
        console.error(e);
    }
    return response;
}
