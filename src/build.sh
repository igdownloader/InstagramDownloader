#!/bin/bash

function build_addon() {
  browser=$1

  # Transpile ts
  tsc -p "tsconfig_$browser.json" || exit

  # Transpile scss
  mkdir "_dist/$browser/css"
  node-sass scss/ -o "_dist/$browser/css"

  # Copy jszip and browser polyfill
  mkdir "_dist/$browser/js/libraries/"
  cp libraries/jszip.min.js "_dist/$browser/js/libraries"
  cp libraries/jszip-utils.min.js "_dist/$browser/js/libraries"

  if [ $browser == 'chrome' ]; then
    cp libraries/browser-polyfill.min.js "_dist/$browser/js/libraries"
  fi

  # Copy all other resources
  cp -r icons/ "_dist/$browser"
  cp "manifest_$browser.json" "_dist/$browser/manifest.json"

  # Create the zip file
  root=$(pwd)

  cd "_dist/$browser" || exit
  zip -r "$browser.zip" ./*

  cd "$root" || exit

  hash addons-linter > /dev/null || (rm -rf _dist && echo 'You have to install the addons-linter from https://www.npmjs.com/package/addons-linter' && exit)
  addons-linter "_dist/$browser/$browser.zip"
}

rm -rf _dist/* || pass

build_addon 'firefox'
build_addon 'chrome'
