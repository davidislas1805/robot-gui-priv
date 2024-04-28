const path = require('path');
const url = require('url');
const {app, BrowserWindow, ipcMain, Menu} = require('electron');
const { SerialPort, DelimiterParser } = require('serialport');
const SERIALFUNCTIONS = require('./serialFunctions')

// process.env.NODE_ENV = 'production';

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';
let robotWindow;
let serialPort = null;

let serial_options = {
  path: '',
  baudRate: 0,
};

function createWindow() {
  // Create the browser window.
  robotWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, './preload.js')
    },
    resizable: false,
    title: "K-AB"
    // icon: path.join(__dirname, 'assets/icons/mac/icon_original.icns')
  });

  // and load the index.html of the app.
  // win.loadFile("index.html"); 
  robotWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, 'index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    robotWindow.webContents.openDevTools({mode: 'detach'});
  }
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

function createSerialConnection(serial_path, baudRate = 115200){
  serial_options.path = serial_path;  // Pass the selected device and adjust de baudrate
  serial_options.baudRate = baudRate;
  
  serialPort = new SerialPort({
      path: serial_options.path,
      baudRate: serial_options.baudRate,
  });
  
  parser = serialPort.pipe(new DelimiterParser({delimiter: '\n'}));
};

ipcMain.handle('get-serial',  async(e) => {
  let _serial_list = await SerialPort.list();
  let serial_paths = [];
  _serial_list.forEach((item) => {
    serial_paths.push(item.path);
  });
  return serial_paths;
});

ipcMain.once('device-explorer-comp:serial-device-name', (e, selected_serial_path) => {
  e.sender.send('main:test-device');
  createSerialConnection(selected_serial_path);

  serialPort.write("Hello\n");
  
  parser.on('data', (data) => {
    e.sender.send('main:successful-device-test', data.toString());
    console.log(data.toString());
  })
})

ipcMain.on('send-HT', (e, data) => {
  if (serialPort !== null) SERIALFUNCTIONS.writeBuffer(SERIALFUNCTIONS.bufferToHT(data), serialPort);
})

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