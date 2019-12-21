# Electron-React-Jest-Eslint Boilerplate

Prerequisite: A newish version of node.js(https://nodejs.org/) should be installed.

This boilerplate was created with the following steps:

## Create a minimal Electron project

Create a new Electron project using create-electron-app:

```node
npx create-electron-app
```

## Install Babel

Babel is used to transpile React's JSX to Javascript.

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
