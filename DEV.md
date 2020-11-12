# Development

## Setting up environment

+ Run `npm install` to get all required packages
+ Change into the firefox folder and run the following commands
+ `node-sass --watch scss/ -o _dist/firefox/css` to transpile the scss every time you make a change
+ `tsc --build tsconfig_firefox.json -w` to transpile the typescript every time you make a change

## Building

+ If you are using some kind of linux
  + Change into the firefox folder and run the *build.sh*
+ If you are using windows:
  + Do yourself a favour and install Linux
