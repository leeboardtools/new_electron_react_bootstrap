# Electron-React-Jest-Eslint Boilerplate

Prerequisite: A newish version of [node.js](https://nodejs.org/) should already be installed (v11.15.0 was used here).

This boilerplate was created with the following steps:

## Create a minimal Electron project

Create a new [Electron](https://electronjs.org/) project using create-electron-app:

```node
npx create-electron-app
```

## Install Babel

[Babel](https://babeljs.io/) is used to transpile React's JSX to Javascript.

1. Install Babel:

```node
npm i @babel/core @babel/preset-env @babel/preset-react --save-dev
```

2. Configure Babel. Create a file called `.babelrc` at the root of the project (where `package.json` is) and add the following to it:

```json
  "babel": {
    "presets": [
      "@babel/env",
      "@babel/react"
    ]
  }
```

## Install Gulp

[Gulp](https://gulpjs.com/) is used to build the Electron project. One key thing it does is pass JSX files on to Babel for transpiling.

1. Install Gulp:

```node
npm i gulp gulp-babel gulp-sourcemaps --save-dev
```

2. Create the Gulpfile. Create a file called 'gulpfile.js' at the root of the project and add the following to it:

```js
const exec = require('child_process').exec;
const gulp = require('gulp');
const babel = require('gulp-babel');
//const css = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');

function html() {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('app/'));
}

function css() {
    return gulp.src('src/**/*.css')
//        .pipe(css())
        .pipe(gulp.dest('app/'));
}

function js() {
    console.log("js");
    return gulp.src(['src/**/*.js', 'src/**/*.jsx'])
         .pipe(sourcemaps.init())
         .pipe(babel())
         .pipe(sourcemaps.write())
         .pipe(gulp.dest('app/'));
};

function launch() {
    return exec(
        __dirname+'/node_modules/.bin/electron .'
    ).on('close', () => process.exit());
}

exports.start = gulp.series(html, css, js, launch);
```

3. Replace the script for ```start``` so it runs the Gulp script. In ```package.json``` change the line:

```json
    "start": "electron-forge start",
```

which is within the ```start``` block, to:

```json
    "start": "gulp start",
```
