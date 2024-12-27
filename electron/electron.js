import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { setupIpcHandlers } from './ipc/index.js';

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

// Add this function to properly clean up
function cleanup() {
  if (mainWindow) {
    mainWindow.destroy();
    mainWindow = null;
  }
  // Force quit the app
  app.quit();
  // If that doesn't work, force exit the process
  process.exit(0);
}

function createWindow() {
  if (mainWindow !== null) {
    return;
  }

  console.log('Creating Electron window...');

  const preloadPath = path.join(__dirname, 
    app.isPackaged ? 'preload.js' : '../electron/preload.js'
  );
  console.log('Preload script path:', preloadPath);

  mainWindow = new BrowserWindow({
    width: 1100,
    height: 600,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    console.log('Development mode: Loading Vite dev server...');
    const devUrl = process.env.VITE_DEV_SERVER_URL + '/orion/';
    console.log('Loading URL:', devUrl);
    mainWindow.loadURL(devUrl).catch((err) => {
      console.error('Failed to load dev server:', err);
      // Fallback to local files if dev server fails
      const indexPath = path.join(__dirname, '../dist/index.html');
      console.log('Falling back to:', indexPath);
      mainWindow.loadFile(indexPath);
    });

    // Open DevTools in development
    //mainWindow.webContents.openDevTools();
  } else {
    console.log('Production mode: Loading built files...');
    const indexPath = app.isPackaged 
      ? path.join(process.resourcesPath, 'app.asar/dist/index.html')
      : path.join(__dirname, '../dist/index.html');
    console.log('Loading file:', indexPath);
    mainWindow.loadFile(indexPath).catch((err) =>
      console.error('Error loading production file:', err)
    );
  }

  mainWindow.on('closed', () => {
    console.log('Main window closed.');
    cleanup();
  });

  // Add error handling
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorDescription);
    console.error('Error code:', errorCode);
  });
}

// Wait for app to be ready before creating window
app.whenReady().then(() => {
  console.log('Electron is ready.');
  setupIpcHandlers(ipcMain);
  createWindow();

  app.on('activate', () => {
    console.log('App activated.');
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  console.log('All windows closed.');
  cleanup();
});

// Add this to ensure proper cleanup
app.on('before-quit', () => {
  console.log('App is quitting...');
  cleanup();
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM...');
  cleanup();
});

process.on('SIGINT', () => {
  console.log('Received SIGINT...');
  cleanup();
});