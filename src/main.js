import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
const { app, BrowserWindow, session } = require('electron');

const isDevMode = process.execPath.match(/[\\/]electron/);
if (isDevMode) {
    installExtension(REACT_DEVELOPER_TOOLS);
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

const createWindow = () => {
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
                    // + ' style-src \'unsafe-inline\';'
                  + ' worker-src \'self\''
                    ]
                }
            });
        });
    }

    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },

    });

    // and load the index.html of the app.
    // eslint-disable-next-line no-undef
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools.
    if (isDevMode) {
    // Open the DevTools.
        mainWindow.webContents.openDevTools();
    }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
