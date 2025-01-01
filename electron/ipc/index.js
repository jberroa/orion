import { setupFileHandlers } from './fileHandlers.js';
import { setupWindowHandlers } from './windowHandlers.js';
import { setupConfigHandlers } from './configHandlers.js';
import { setupRequestHandler } from "./requestHandler.js";
import { setupGitHandlers } from './gitHandler.js';
import { setupDockerHandlers } from './dockerHandler.js';
import { setupTomcatFoldersHandlers } from './tomcatFolders.js';
import { setupServiceHandlers } from './serviceHandlers.js';

export const setupIpcHandlers = (ipcMain) => {
  setupFileHandlers(ipcMain);
  setupWindowHandlers(ipcMain);
  setupConfigHandlers(ipcMain);
  setupRequestHandler(ipcMain);
  setupGitHandlers(ipcMain);
  setupDockerHandlers(ipcMain);
  setupTomcatFoldersHandlers(ipcMain);
  setupServiceHandlers(ipcMain);
}; 