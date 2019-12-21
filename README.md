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
  {
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

4. Rename ```index.js```. Later on we'll add a JS file loaded by ```index.html``` that will be the entry point of the render processes. To avoid confusion we'll rename the existing ```index.js``` as ```main.js```.

5. Update ```package.json``` to point to ```main.js```. In ```package.json``` change the line:

```json
    "main": "src/index.js",
```

to:

```json
"main": "app/main.js",
```

Note that it points to the ```app``` folder, not the ```src```, since ```app``` is where Gulp sends all the processed output, including the output files of Babel.

## Install React
[React](https://reactjs.org/) is what this project uses to build the UI.

1. Install React:

```node
npm i react react-dom --save-dev
```

2. We need to enable the use of ```node``` in the browser window. In ```src/main.js``` change the following code block:

```js
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
```

to be:
```js
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
  });
```

If you don't do this then the simplest things like ```require()``` calls will generate errors when you try to run the project.

3. Create an App component. Create the file ```src/App.jsx``` and add the following to it:

```js
import React from 'react';

export default function App() {
    return <div>I'm the React App</div>;
}
```

4. Create the main renderer process entry point. Create the file ```src/renderer.js``` and add the following to it:

```js
import React from 'react';
import ReactDOM from 'react-dom';
//import {AppContainer} from 'react-hot-loader';
//require('bootstrap');

const render = () => {
  const App = require('./App').default;
  ReactDOM.render(<App />, document.getElementById('App'));
}

render();
if (module.hot) {
  module.hot.accept(render);
}
```

5. Update ```index.html``` to load ```src/renderer.js``` and work with it. Modify the contents of the ```<body>``` tag so it reads:

```html
  <body>
    <div id="App">Oh no.</div>
    <script src="./renderer.js"></script>
  </body>
```

## Install React Developer Tools
React Developer Tools is a Chrome extension that adds React debugging tools to Chrome Developer Tools. In Electron it is part of the [DevTools Extension](https://electronjs.org/docs/tutorial/devtools-extension).

1. Install the tools:

```node
npm i electron-devtools-installer --save-dev
```

2. Edit ```src/main.js``` to load the tools. Add the following:

```js
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
```

to the top of the file.

3. Add the following:

```js
    const isDevMode = process.execPath.match(/[\\/]electron/);
    if (isDevMode) {
        installExtension(REACT_DEVELOPER_TOOLS);
    }
```

after the ```imports```/```require()```s.

4. While we've added ```isDevMode```, we might as well bracket the opening of the main DevTools. Replace the following lines:

```js
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
```

with

```js
  if (isDevMode) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }
```
