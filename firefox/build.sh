#!/usr/bin/env bash

# Check if _dist folder exists
rm -rf _dist/* || pass

# Transpile ts
tsc -p tsconfig.json

# Transpile scss
mkdir _dist/css
node-sass scss/ -o _dist/css

# Copy jszip
mkdir _dist/js/libraries/
cp libraries/jszip.min.js _dist/js/libraries/
cp libraries/jszip-utils.min.js _dist/js/libraries/

# Copy all other resources
cp -r icons/ _dist/
cp manifest.json _dist/

# Create the zip file
cd _dist || echo 'Could not go into the direcoty'
zip -r firefox.zip ./*
cd ..

# Check if the addons-linter is installed
hash addons-linter > /dev/null || (rm -rf _dist && echo 'You have to install the addons-linter from https://www.npmjs.com/package/addons-linter' && exit)

# Lint the addon
echo ''
addons-linter _dist/firefox.zip

