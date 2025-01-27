import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { setupIpcHandlers } from './ipc/index.js';
import { ensureSettingsFile } from './ipc/fileHandlers.js';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
let isQuitting = false;
console.log('Settings file location:', path.join(app.getPath('userData'), 'settings.json'));
// Add this function to properly clean up
function cleanup() {
  if (isQuitting) return;
  isQuitting = true;

  mainWindow = null;
  app.quit();  
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
    mainWindow = null;
    app.quit();
    //cleanup();  // Call cleanup when window is closed
  });

  // Add error handling
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorDescription);
    console.error('Error code:', errorCode);
  });
}

// Wait for app to be ready before creating window
app.whenReady().then(async () => {
  try {
    // Ensure settings file exists before creating window
    await ensureSettingsFile();
    
    console.log('Electron is ready.');
    setupIpcHandlers(ipcMain);
    createWindow();

    app.on('activate', () => {
      console.log('App activated.');
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  } catch (error) {
    console.error("Error during app startup:", error);
    app.quit();
  }
});

// Modify window-all-closed event to always quit
app.on('window-all-closed', () => {
  console.log('All windows closed.');
  if (process.platform !== 'darwin') {  // If not macOS
    app.quit();
  }
});

// Add this to ensure proper cleanup
app.on('before-quit', async (event) => {
  console.log('App is quitting...');
  event.preventDefault();
  
  let repoPath, confPath, dockerComposePath;
  
  try {
    // Get settings from app's user data path
    const settings = JSON.parse(
      fs.readFileSync(path.join(app.getPath('userData'), 'settings.json'), 'utf-8')
    );

    dockerComposePath = path.join(
      app.isPackaged ? process.resourcesPath : process.cwd(),
      "docker",
      "docker-compose.yml"
    );
    
    // Use repoPath from settings
    repoPath = settings.repoPath;
    confPath = app.isPackaged
      ? path.join(process.resourcesPath, 'conf')
      : path.join(process.cwd(), 'conf');

    // Check if containers are running
    const checkCommand = `PATH_TO_REPOS=${repoPath} PATH_TO_CONF=${confPath} podman compose -f ${dockerComposePath} ps --quiet`;
    const { stdout } = await execAsync(checkCommand);
    
    if (!stdout.trim()) {
      console.log('No Docker Compose containers running, skipping shutdown...');
      return true;
    }
    
    const command = `PATH_TO_REPOS=${repoPath} PATH_TO_CONF=${confPath} podman compose -f ${dockerComposePath} down --timeout 10`;
    
    console.log('Containers running, attempting graceful docker shutdown...');
    await execAsync(command);
    return true;
  } catch (error) {
    console.error('Error during graceful docker shutdown:', error);
    
    try {
      // Also include env vars in force shutdown
      const command = `PATH_TO_REPOS=${repoPath} PATH_TO_CONF=${confPath} podman compose -f ${dockerComposePath} down -t 1`;
      console.log('Attempting force docker shutdown...');
      await execAsync(command);
      return true;
    } catch (forceError) {
      console.error('Force shutdown also failed:', forceError);
      return false;
    }
  }
});