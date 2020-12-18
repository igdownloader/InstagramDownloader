/*
 * Copyright (c) 2020. HuiiBuh
 * This file (webpack.config.js) is part of InstagramDownloader which is released under
 * GNU LESSER GENERAL PUBLIC LICENSE.
 * You are not allowed to use this code or this file for another project without
 * linking to the original source AND open sourcing your code.
 */

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require('path');
const webpack = require('webpack');


const webpackConfig = {
    node: {
        global: false,
    },
    entry: {
        extension: "./src/ts/index.ts",
        background: "/src/ts/background/background.ts",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [
                    // Extract and save the final CSS.
                    MiniCssExtractPlugin.loader,
                    // Load the CSS, set url = false to prevent following urls to fonts and images.
                    {loader: "css-loader", options: {url: false, importLoaders: 1}},
                    // Load the SCSS/SASS
                    {loader: 'sass-loader'},
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new webpack.ProvidePlugin({
            global: require.resolve('./src/global.js'),
        }),
    ],
};


module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        webpackConfig.devtool = 'inline-source-map';
        webpackConfig.plugins.push(
            new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(false),
            }),
        );
    } else if (argv.mode === 'production') {
        webpackConfig.plugins.push(
            new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(false),
            }),
        );
    }

    return webpackConfig;
};
