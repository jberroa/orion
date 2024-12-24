import { app } from 'electron';
// import Store from 'electron-store';

// const store = new Store();

export const setupConfigHandlers = (ipcMain) => {
  ipcMain.handle('get-config', (_event, key) => {
    // return store.get(key);
    return 'test';
  });

  ipcMain.handle('set-config', (_event, { key, value }) => {
    // store.set(key, value);
    return true;
  });
}; 