import { setupFileHandlers } from './fileHandlers.js';
import { setupWindowHandlers } from './windowHandlers.js';
import { setupConfigHandlers } from './configHandlers.js';

export const setupIpcHandlers = (ipcMain) => {
  setupFileHandlers(ipcMain);
  setupWindowHandlers(ipcMain);
  setupConfigHandlers(ipcMain);
}; 