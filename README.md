# Electron-React-Jest-ESLint-Bootstrap Boilerplate

This boilerplate is my starting point for projects with the following:

- [Electron](https://electronjs.org/)
- [React](https://reactjs.org/)
- [Jest](https://jestjs.io/)
- [ESLint](https://eslint.org/)
- [Bootstrap](https://getbootstrap.com/)

It uses [Electron Forge](https://www.electronforge.io/)'s ```create-electron-app``` to create the initial project.

It also incorporates [Babel](https://babeljs.io/) and [Webpack](https://webpack.js.org/).


Prerequisite: A newish version of [node.js](https://nodejs.org/) should already be installed (v11.15.0 was used here).

This boilerplate was created with the following steps:

## Create a minimal Electron project with Webpack using the Webpack template

Create a new [Electron](https://electronjs.org/) project using create-electron-app:

```node
npx create-electron-app new_electron_react_bootstrap --template=webpack
```

## Install Babel

[Babel](https://babeljs.io/) is used to transpile React's JSX to Javascript.

1. Install Babel:

```node
cd new_electron_react_bootstrap
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

3. Webpack needs the Babel loader:

```node
npm i --save-dev babel-loader
```

4. Configure Webpack for the loader. Edit the file `webpack.renderer.config.js` and add the line
`resolve: { extensions: [".js", ".jsx"] },` right before the `module` section in `module.exports`,
it should look something like:

```json
  const rules = require('./webpack.rules');

  rules.push({
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
  });

  module.exports = {
    // Put your normal webpack config below here
    resolve: { extensions: [".js", ".jsx"] },
    module: {
      rules,
    },
  };
```

Edit the file `webpack.rules.js`, adding the following to the `module.exports` array:

```json
,
  {
    test: /\.(js|jsx)$/,
    exclude: /(node_modules|bower_components)/,
    loader: "babel-loader",
  },
```

5. For Babel ```async``` function support, first install:

```node
npm i regenerator-runtime core-js --save-dev
```

6. Then add the following to the top of `renderer.js`:

```js
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```


## Install React
[React](https://reactjs.org/) is what this project uses to build the UI.

1. Install React:

```node
npm i react react-dom
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
    return <div className="container-fluid">
        <div>I am the React App</div>
        <div className="alert alert-primary">
            This is Bootstrap
        </div>
    </div>;
}
```

4. Replace the contents of the file ```src/renderer.js``` with:

```js
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const render = () => {
  ReactDOM.render(<App />, document.getElementById('App'));
};

render();
if (module.hot) {
  module.hot.accept(render);
}
```

5. Update ```index.html```. Modify the contents of the ```<body>``` tag so it reads:

```html
  <body>
    <div id="App">Oh no.</div>
  </body>
```

6. At this point you should be able to run the 'npm-start' task and the app will launch.
There should be one warning:

`Electron Security Warning (Insecure Content-Security-Policy)`


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

5. More on the `Electron Security Warning (Insecure Content-Security-Policy)` warning:

You can add a Content-Security-Policy to main.js to get rid of that warning, however
at the time of this writing there's a bug in electron such that you can't manually
open the devTools window (<https://github.com/electron/electron/issues/20069)>.

The following was added to the `createWindow()` function in `main.js`, right before the call
to `mainWindow = new BrowserWindow(` line:

```js
    // TODO isDevMode test is a hack to get the devTools to show up, as it's
    // currently broken
    if (!isDevMode) {
        session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
            callback({
                responseHeaders: {
                    ...details.responseHeaders,
                    'Content-Security-Policy': ['default-src child-src \'self\''
                     + ' object-src \'none\''
                     + ' script-src \'self\';'
                     + ' frame-src \'self\';'
                     + ' style-src \'unsafe-inline\';'
                     + ' worker-src \'self\''
                    ]
                }
            });
        });
    }
```

```session``` should also be added to the ```require('electron')``` line:

```js
const { app, BrowserWindow, session } = require('electron');
```


## Install Jest
[Jest](https://jestjs.io/) is a test platform.

1. Install Jest:

```node
npm i babel-jest jest jest-environment-jsdom-fourteen jest-watch-typeahead react-app-polyfill --save-dev
```

The following were copied or adapted from the boilerplate project generated by [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app).


2. Add the following to the bottom of ```package.json```, before the last '}':

```json
,
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.d.ts"
    ],
    "setupFiles": [
      "react-app-polyfill/jsdom"
    ],
    "setupFilesAfterEnv": [],
    "testMatch": [
      "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
      "<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}"
    ],
    "testEnvironment": "jest-environment-jsdom-fourteen",
    "transform": {
      "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
      "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
      "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
    },
    "transformIgnorePatterns": [
      "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
      "^.+\\.module\\.(css|sass|scss)$"
    ],
    "modulePaths": [],
    "moduleNameMapper": {
      "^react-native$": "react-native-web",
      "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy"
    },
    "moduleFileExtensions": [
      "web.js",
      "js",
      "web.ts",
      "ts",
      "web.tsx",
      "tsx",
      "json",
      "web.jsx",
      "jsx",
      "node"
    ],
    "watchPlugins": [
      "jest-watch-typeahead/filename",
      "jest-watch-typeahead/testname"
    ]
  }
```

3. Add the following to the ```scripts``` section of ```package.json```:

```json
    "test": "jest --watch",
    "test-once": "jest"
```

4. Add a ```config/jest``` folder to the root of the project.

5. Create the file ```config/jest/cssTransform.js``` and add the following to it:

```js
'use strict';

// This is a custom Jest transformer turning style imports into empty objects.
// http://facebook.github.io/jest/docs/en/webpack.html

module.exports = {
  process() {
    return 'module.exports = {};';
  },
  getCacheKey() {
    // The output is always the same.
    return 'cssTransform';
  },
};
```

6. Create the file ```config/jest/fileTransform.js``` and add the following to it:

```js
'use strict';

const path = require('path');
const camelcase = require('camelcase');

// This is a custom Jest transformer turning file imports into filenames.
// http://facebook.github.io/jest/docs/en/webpack.html

module.exports = {
  process(src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename));

    if (filename.match(/\.svg$/)) {
      // Based on how SVGR generates a component name:
      // https://github.com/smooth-code/svgr/blob/01b194cf967347d43d4cbe6b434404731b87cf27/packages/core/src/state.js#L6
      const pascalCaseFileName = camelcase(path.parse(filename).name, {
        pascalCase: true,
      });
      const componentName = `Svg${pascalCaseFileName}`;
      return `const React = require('react');
      module.exports = {
        __esModule: true,
        default: ${assetFilename},
        ReactComponent: React.forwardRef(function ${componentName}(props, ref) {
          return {
            $$typeof: Symbol.for('react.element'),
            type: 'svg',
            ref: ref,
            key: null,
            props: Object.assign({}, props, {
              children: ${assetFilename}
            })
          };
        }),
      };`;
    }

    return `module.exports = ${assetFilename};`;
  },
};
```

6. For ```async``` function support, create a file ```src/setupTests.js``` and add the following to it:

```js
import 'regenerator-runtime/runtime';
```

8. Edit ```package.json```, setting the ```setupFilesAfterEnv``` property of the ```jest``` section to:

```json
    "setupFilesAfterEnv": [
      "./src/setupTests.js"
    ],
```

6. To see that Jest runs, create a file ```src/myFile.test.js``` and add the following to it:

```js
test('A Test', () => {
    expect(true).toBeTruthy();
});

test('Async Test', async () => {
    const result = await new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        },
        10);
    });
    expect(result).toBeTruthy();
});
```

You should then be able to run the ```npm test``` script which should run Jest, resulting in an output like:

```txt
 PASS  src/myFile.test.js
  ✓ A Test

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.263s, estimated 1s
Ran all test suites related to changed files.

Watch Usage: Press w to show more.
```


## Install ESLint
[ESLint](https://eslint.org/) is a Javascript linter that statically analyzes the code.

1. Install ESLint:

```node
npm i eslint eslint-plugin-react --save-dev
```

2. Create the configuration file:

```node
npx eslint --init
```

The following answers were given for this project:

```txt
? How would you like to use ESLint? To check syntax, find problems, and enforce code style
? What type of modules does your project use? JavaScript modules (import/export)
? Which framework does your project use? React
? Does your project use TypeScript? No
? Where does your code run? Browser, Node
? How would you like to define a style for your project? Answer questions about your style
? What format do you want your config file to be in? JavaScript
? What style of indentation do you use? Spaces
? What quotes do you use for strings? Single
? What line endings do you use? Unix
? Do you require semicolons? Yes
The config that you've selected requires the following dependencies:

eslint-plugin-react@latest
Warning: React version not specified in eslint-plugin-react settings. See https://github.com/yannickcr/eslint-plugin-react#configuration .
Successfully created .eslintrc.js file in /home/albert/Projects/Javascript/test/test
```

3. Modify the ESLint configuration file rules as desired. The following were added to the file ```.eslintrc```:

```js
        "no-multi-spaces": ["error", {"ignoreEOLComments": true}],
        "comma-dangle": "off",
        "operator-linebreak": [ "error", "before", { "overrides": { "+": "before", "?": "before", ":": "before", "=": "after" }} ],
        "padded-blocks": "off",
        "brace-style": ["error", "stroustrup", { "allowSingleLine": true }],
        "space-before-function-paren": ["error", {"named": "never"}],
        "keyword-spacing": "error",
        "space-infix-ops": "error",
        "comma-spacing": "error",
        "eqeqeq": "error",
        "curly": "error",
        "one-var": ["error", "never"],
        "block-spacing": "error",
        "comma-style": ["error", "last"],
        "dot-location": ["error", "property"],
        "func-call-spacing": "error",
        "new-cap": "error",
        "new-parens": "error",
        "constructor-super": "error",
        "no-array-constructor": "error",
        "no-caller": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-labels": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-object": "error",
        "no-unused-vars": ["error", { "args": "none" }],
        "no-whitespace-before-property": "error",
        "object-property-newline": ["error", {"allowAllPropertiesOnSameLine": true}],
        "semi-spacing": "error",
        "space-before-blocks": "error",
        "space-unary-ops": "error",
        "use-isnan": "error",
        "valid-typeof": "error",
        "wrap-iife": "error",
        "jsx-quotes": ["error", "prefer-double"],
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        "react/jsx-handler-names": "off",
        "react/prefer-stateless-function": 0
```

4. Update ```eslintrc.js``` to remove React version warning. Add the following to the ```module.exports``` object in ```eslintrc.js```:

```js
    'settings': {
        "react": {
            "version": "detect",
        }
    },
```

5. Update ```eslintrc.js``` to support Jest. Add the following to the ```env``` property of the  ```module.exports``` object in ```eslintrc.js```:

```js
        'jest': true,
```

6. Update the lint script in `package.json`, replacing the `lint` entry in `scripts` with:

```json
    "lint": "eslint --cache --color --ext .jsx,.js src",
```


## Configure Markdown Lint
Markdown has its own linting via the [markdownlint](https://github.com/DavidAnson/vscode-markdownlint) VSCode extension.

1. Create the file ```.markdownlint.json```. The following rules were added to it:

```json
{
    "blanks-around-headings": { "lines_below": 0 },
    "blanks-around-lists": false,
    "no-multiple-blanks": false,
    "line-length": false,
    "ul-indent": { "indent": 4},
    "ol-prefix": false
}
```


## Install Bootstrap
[Bootstrap](https://getbootstrap.com/) is a UI library that defines many components via CSS.

1. Install Bootstrap:

```node
npm i bootstrap
```

2. Install [jQuery](https://jquery.com/) and [Popper.js](https://popper.js.org/), which are only required for certain Bootstrap components:

```node
npm i jquery popper.js
```

3. Update ```renderer.js``` with the Bootstrap CSS. Add the following to the imports section:

```js
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
```


## Install JSDoc
[JSDoc](https://jsdoc.app/about-getting-started.html) is an API documentation generator for Javascript.

1. Install JSDoc:

```node
npm i jsdoc --save-dev
```

2. Add a script to `package.json`:

```json
  "jsdoc": "jsdoc src -r -d docs",
```

3. Exclude the generated docs from Git. Add the following to the bottom of the `.gitignore` file:

```txt
# Docs Output
docs/
```
