const path = require('path');
const url = require('url');
const {app, BrowserWindow, ipcMain, Menu} = require('electron');

// process.env.NODE_ENV = 'production';

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';
let robotWindow;

function createWindow() {
  // Create the browser window.
  robotWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, './preload.js')
    },
    resizable: false
  });

  // and load the index.html of the app.
  // win.loadFile("index.html"); 
  robotWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    robotWindow.webContents.openDevTools({mode: 'detach'});
  }
}

function aboutWindow() {
  // Create the browser window.
  about = new BrowserWindow({
    width: 150,
    height: 300,
    webPreferences: {
      nodeIntegration: true
    },
    resizable: false,
    parent: 'top'
  });

  // and load the index.html of the app.
  // win.loadFile("index.html"); 
  about.loadURL(
    isDev
      ? 'http://localhost:3000/#about'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then( () => {
  createWindow();
  
  //Menu template:
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

const menu = [
  ...(isMac ? [{
    label: app.name,
    submenu: [
      {
        label: 'About',
        click: () => robotWindow.send('show-about')
      }
    ]
  }] : []),
  {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        click: () => app.quit(),
        accelerator: 'CmdOrCtrl+Q'
      }
    ]
  }
];