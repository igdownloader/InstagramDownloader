## Looking for a new maintainer or buyer 

Hi, I am looking for a new maintainer, because I do not use IG and I do not find any pleasure in developing this extension any more. 
If you want to maintain this extension please contact me.


# InstagramDownloader

Firefox and Chrome Extension which creates an download button for instagram images and videos on the right of the
bookmark icon.

Install on [Firefox](https://addons.mozilla.org/en-GB/firefox/addon/instagram_download/)
and on [Chrome](https://chrome.google.com/webstore/detail/instagram-downloader/cpgaheeihidjmolbakklolchdplenjai).

## General Download

![DownloadButton](https://i.imgur.com/IG7Im8F.jpg)

A Download Button appearers while you hover over the image you want to download.

![Hover and Download](https://i.imgur.com/ZFA6ct0.jpg)

## Profile Picture

The same happens if you hover over the profile picture.

![Hover and Download](https://i.imgur.com/axnMJgD.png)

## Bulk Download

Now it is possible to download all images and videos of one profile at once. The Button apperes right next to
the `follow` button. The feature includes scrolling down until all images are loaded, so it may take a while. It is also
possible that instagram will ban you temporarily (just a few minutes) if you try to download like 1000 pictures.  
If you click on the `download all` button the page will begin scrolling down to load the new pictures until every
picture of the profile got loaded once. After that a ZIP file with all the images in it will be created.  
This may take a while depending on your internet connection and the amount of pictures you plan to download.

![Download all](https://i.imgur.com/8DFcGVp.png)

## Story Download

From version 1.5+ it is possible to download Instagram Stories. The extension supports both image and video downloads.

![Download Story](https://i.imgur.com/Hy3qJod.png)

## Development

### Getting started

The main class is (obviously) the `index.ts`. Here the different downloaders subscribe to the `URLChangeEmitter` which
in turn notifies the different downloaders when they should be added to the page.  
The collection of the image links is handled in the downloaders. The retrieved image links get send to the background
script where the download happens.

### Building

The build script depends on linux, especially on the zip util which should be included in most linux distros. Building
in Windows is only partially supported.  
To Execute the build script run `npm install` and after the installation is complete execute `webpack`. There are
different flags which change the build.

- _--watch_ starts the build in watch mode and rebuilds the project if files get changed
- _--mode=production_ generates a production build without source maps and logging. In addition to these changes a zip
  files for the different browsers will get generated and linted.
- _--mode=development_ generates a development build with source maps and logging. No zip files get generated and no
  linting script gets executed.

The two flags can be combined if needed `webpack --mode=production --watch`.

## Credits

- The files get zipped with [JSZip](https://github.com/Stuk/jszip)
- Error logging inspired by [refined-github](https://github.com/sindresorhus/refined-github)
- The Download Icon is from [ShareIcon](https://www.shareicon.net/instagram-social-media-icons-880117) and was created
  by [Aarthi Padmanabhan](https://www.shareicon.net/author/aarthi-padmanabhan)
- The PayPal Icon is from [Wikipedia](https://wikipedia.org)
- The close icon is from [Google material design icons](https://github.com/google/material-design-icons)
