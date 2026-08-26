import electronPkg from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import '../server/engine.js';
import { setElectronWindow } from '../server/engine.js';

const { app, BrowserWindow, Menu } = electronPkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
const PORT = process.env.PORT || 5050;

async function loadApp(win) {
  const url = `http://127.0.0.1:${PORT}`;
  let attempts = 0;
  while (attempts < 30) {
    try {
      await win.loadURL(url);
      win.show();
      return;
    } catch {
      attempts++;
      await new Promise(r => setTimeout(r, 200));
    }
  }
}

function createWindow() {
  Menu.setApplicationMenu(null);
  mainWindow = new BrowserWindow({
    width: 1320,
    height: 860,
    minWidth: 1080,
    minHeight: 700,
    backgroundColor: '#09090b',
    title: 'ApexTweak',
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
  });

  setElectronWindow(mainWindow);

  loadApp(mainWindow);

  mainWindow.on('closed', () => {
    mainWindow = null;
    setElectronWindow(null);
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
