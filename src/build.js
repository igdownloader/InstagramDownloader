/*
 * Copyright (c) 2021. HuiiBuh
 * This file (build.js) is part of InstagramDownloader which is released under
 * GNU LESSER GENERAL PUBLIC LICENSE.
 * You are not allowed to use this code or this file for another project without
 * linking to the original source AND open sourcing your code.
 */

const fs = require('fs');
const fse = require('fs-extra');
const exec = require('child_process').execSync;

class BuildExtensionPlugin {

    constructor() {
        this.production = false;
    }


    apply(compiler) {
        compiler.hooks.done.tap('BuildExtensionPlugin', async (params) => {
            this.production = params.compilation.options.mode === "production";
            await this.build();
        });
    }

    async build() {

        // Check if dir exists and create it otherwise
        if (!(await fs.existsSync('zip'))) {
            await fs.promises.mkdir('zip');
        }

        // Generate the extension for every browser
        for (const browser of ["chrome", "firefox"]) {
            await this.assembleExtensionFiles(browser);
            try {
                await this.execute(`cd zip/${browser} && zip ../${browser}.zip * -r && cd ../..`);
            } catch {
                console.warn("Please install the zip util to get automatic zipping");
                // No zip installed
            }

            if (this.production) {
                console.log(`Linting ${browser}`);
                console.log(
                    await this.execute(`addons-linter zip/${browser}.zip`),
                );
            }
        }

        if (this.production) {
            await this.execute("git archive --format zip --output zip/InstagramDownloader.zip HEAD");
        }
    };

    /**
     * Collect all files necessary to build the extension
     * @param browser The browser
     */
    async assembleExtensionFiles(browser) {
        const path = `zip/${browser}`;
        if (await fs.existsSync(path)) {
            await fs.promises.rm(path, {recursive: true});
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
    execute(command) {
        let response = "";
        try {
            response = exec(command, {encoding: "utf-8"});
        } catch (e) {
            console.error(e);
        }
        return response;
    }
}


module.exports = BuildExtensionPlugin;
