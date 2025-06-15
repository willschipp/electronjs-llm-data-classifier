const { app, BrowserWindow, ipcMain, session } = require('electron/main')
const path = require('path')

const { run, extract } = require('../ai/model.js');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname,'../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  mainWindow.loadFile(path.join(__dirname,'../renderer/index.html'));
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  //register the backend/frontend hooks
  ipcMain.handle('transformers:run',run);
  ipcMain.handle('transformers:extract',extract);

  createWindow()

  app.on('activate',() => {
    if (BrowserWindow.getAllWIndows().length === 0) {
        createWindow()
    }
  })
});

app.on('window-all-closed',() => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});