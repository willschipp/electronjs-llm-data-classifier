import { app, BrowserWindow, ipcMain } from 'electron';
// const { app, BrowserWindow, ipcMain } = require('electron');
import path from 'path';
// const { path } = require('path');
import { fileURLToPath } from 'url';
// const { fileURLToPath } = require('url');

// const { run } = require('./ai/main.js');
import { run, detect } from './ai/main.cjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, '../electron/preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        }
    });

    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'),{hash:'home'});
    mainWindow.webContents.openDevTools(); // this is optional thing, use it if you see a devTool window opened
}

app.whenReady().then(() => {
    ipcMain.handle('transformers:run',run);//register run
    ipcMain.handle('openvino:detect',detect);
    //create the window
    createWindow()

    app.on('activate',() => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
});//.then(createWindow)

app.on('window-all-closed', () => {
    // eslint-disable-next-line no-undef
    if (process.platform !== 'darwin') {
        app.quit()
    }
})