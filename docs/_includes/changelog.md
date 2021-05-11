### Version 4.4.5

#### Fixes:
+ Made the download more robust


### Version 4.4.4

#### Fixes:

+ **NEW PERMISSIONS:** These are necessary to download the images from the facebook (IG parent company) and instagram
  CDNs.
+ Multiple download issues in chrome and firefox

#### New:

+ Show you if IG detected that you use a download tool

---

### Version 4.4.2

#### Fixes:

+ Some chrome version require the webRequest permission to be able to download images, so here it is.

---

### Version 4.4.1

#### Fixes:

+ Fixed query selector for the download all button

---

### Version 4.4.0

#### New:

+ Removed the ugly download all button and replaced it with a new button right next th your home icon.
+ I requested **new permissions** in the firefox version, so the bulk download can work again. As always this will not
  put your data at risk and if anyone has any doubts you can view the code
  on [GitHub](https://github.com/HuiiBuh/InstagramDownloader) .

#### Fixes:

+ Fixed bulk download not working [#170](https://github.com/HuiiBuh/InstagramDownloader/issues/170)
+ Fixed the story download which was sometimes not
  working  [#166](https://github.com/HuiiBuh/InstagramDownloader/issues/166)
+ Made the bulk download slower to avoid a ban from
  instagram [#158](https://github.com/HuiiBuh/InstagramDownloader/issues/158)

---

### Version 4.3.1

#### Fixes:

+ Fixed download not working for
  Firefox [#165](https://github.com/HuiiBuh/InstagramDownloader/issues/165) [@Kwizatz](https://github.com/Kwizatz)

---

### Version 4.3.0

#### New:

+ Added Reel download [#140](https://github.com/HuiiBuh/InstagramDownloader/issues/140)
+ Support new Post
  View [#157](https://github.com/HuiiBuh/InstagramDownloader/issues/157) [@andrewsuzuki](https://github.com/andrewsuzuki)
+ Added new Instagram Downloader Website

#### Fixes:

+ Fixed naming to improve file system compatibility [#161](https://github.com/HuiiBuh/InstagramDownloader/issues/161)

---

### Version 4.2.2

#### New:

+ Improved error handling. New errors will be displayed to the user

#### Fixes:

+ Fixed error logging decorator [@UaQuetzalcoatl](https://github.com/UaQuetzalcoatl)
+ Fix story download not working with localization
  parameter [#146](https://github.com/HuiiBuh/InstagramDownloader/issues/146)

---

### Version 4.2.1

#### New:

+ Automated the build even more. Now building with --watch is working

#### Fixes:

+ Download button not appearing on multi image posts [#134](https://github.com/HuiiBuh/InstagramDownloader/issues/134)
+ Continually tries to download "Download All" bulk zip
  file [#130](https://github.com/HuiiBuh/InstagramDownloader/issues/130)
+ Use the linux zipping util for building in prod, so the zip can be used for uploading to the chrome store

---

### Version 4.2.0

#### New:

+ See the progress of the download, and the compression progress
+ Added Easter egg on the changelog page

#### Fixes:

+ Preserve original file name [#125](https://github.com/HuiiBuh/InstagramDownloader/issues/125)
+ Fixed story download resolution [#123](https://github.com/HuiiBuh/InstagramDownloader/issues/123)
+ Increased account image resolution [#123](https://github.com/HuiiBuh/InstagramDownloader/issues/123)

---

### Version 4.1.1

#### Fixes:

+ Changed PayPal link so PayPal does not keep 40%
+ Download button moves down when you scroll, so you can start the download from everywhere
+ Customize the download speed
+ Source Code bundling with Webpack

---

### Version 4.0.0

#### New:

+ See the progress of you background downloads

#### Fixes:

+ Download all button stays on top of the page #105
+ Customize scroll interval [#106](https://github.com/HuiiBuh/InstagramDownloader/issues/106)
+ Download correct story image [#108](https://github.com/HuiiBuh/InstagramDownloader/issues/108)
+ Fix video download [#109](https://github.com/HuiiBuh/InstagramDownloader/issues/109)
+ Removed lots of unnecessary code

---

### Version 3.4.1

#### New:

+ Download all button on saved page

#### Fixes:

+ Download all button not appearing
