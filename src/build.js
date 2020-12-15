/*
 * Copyright (c) 2020. HuiiBuh
 * This file (build.js) is part of InstagramDownloader which is released under
 * GNU LESSER GENERAL PUBLIC LICENSE.
 * You are not allowed to use this code or this file for another project without
 * linking to the original source AND open sourcing your code.
 */

const fs = require('fs');
const JSZip = require('jszip');

const browserList = ["chrome", "firefox"];


(async function () {

    // Check if dir exists and create it otherwise
    if (!(await fs.existsSync('zip'))) {
        await fs.promises.mkdir('zip');
    }

    // Generate the extension for every browser
    for (const browser of browserList) {
        const zip = new JSZip();
        await saveFileToZip(zip, `src/manifest_${browser}.json`, 'manifest.json');
        await saveDirectoryToZip(zip, "src/icons");
        await saveDirectoryToZip(zip, "dist");

        zip.generateNodeStream({type: 'nodebuffer', streamFiles: true})
            .pipe(fs.createWriteStream(`zip/${browser}.zip`));
    }

    console.log('\nSuccessfully created the extension zip files');
})();

/**
 * Save a directory to a zip file
 * @param zip The zip file
 * @param directory The directory
 * @param leaveRoot Should the root folder not be added as path
 */
async function saveDirectoryToZip(zip, directory, leaveRoot = true) {
    const files = await fs.promises.readdir(directory);

    // For every file in a folder
    for (const file of files) {

        // Go through the directory and collect every file
        if ((await fs.promises.lstat(`${directory}/${file}`)).isDirectory()) {
            await saveDirectoryToZip(zip, `${directory}/${file}`, leaveRoot);
        } else {
            if (leaveRoot) {
                let dir = directory.split("/").splice(1, directory.length - 2).join("/");
                if(dir) dir += "/"
                await saveFileToZip(zip, `${directory}/${file}`, `${dir}${file}`);
            } else {
                await saveFileToZip(zip, `${directory}/${file}`);
            }
        }

    }

}


/**
 * Save a file to the zip
 * @param zip The zip file
 * @param fileLocation The file location
 * @param filename The file name
 */
async function saveFileToZip(zip, fileLocation, filename = fileLocation) {
    const manifest_data = (await fs.promises.readFile(fileLocation));
    zip.file(filename, manifest_data);
}
