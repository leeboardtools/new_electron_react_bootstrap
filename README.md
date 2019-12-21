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

2. Configure Babel. Create a file called `.babelrc` at the root of the project (where `package.json` is) and add the following:

```json
  "babel": {
    "presets": [
      "@babel/env",
      "@babel/react"
    ]
  }
```
