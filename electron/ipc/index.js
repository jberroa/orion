import { setupFileHandlers } from './fileHandlers.js';
import { setupWindowHandlers } from './windowHandlers.js';
import { setupConfigHandlers } from './configHandlers.js';
import { setupRequestHandler } from "./requestHandler.js";

export const setupIpcHandlers = (ipcMain) => {
  setupFileHandlers(ipcMain);
  setupWindowHandlers(ipcMain);
  setupConfigHandlers(ipcMain);
  setupRequestHandler(ipcMain);
}; 