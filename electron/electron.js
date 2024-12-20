import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  console.log('Creating Electron window...');

  mainWindow = new BrowserWindow({
    width: 1100,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Optional, can be omitted if not using preload
      nodeIntegration: false, // Enable only if necessary
      contextIsolation: true, // Recommended for security
    },
  });

  // Check if running in development mode
  if (process.env.VITE_DEV_SERVER_URL) {
    console.log('Development mode: Loading Vite dev server...');
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL).catch((err) =>
      console.error('Error loading Vite dev server:', err)
    );
  } else {
    console.log('Production mode: Loading built files...');
    const indexPath = path.join(__dirname, 'dist/index.html');
    console.log('Loading file:', indexPath);
    mainWindow.loadFile(indexPath).catch((err) =>
      console.error('Error loading production file:', err)
    );
  }

  mainWindow.on('closed', () => {
    console.log('Main window closed.');
    mainWindow = null;
  });
}

app.on('ready', () => {
  console.log('Electron is ready.');
  createWindow();
});

app.on('window-all-closed', () => {
  console.log('All windows closed.');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  console.log('App activated.');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});