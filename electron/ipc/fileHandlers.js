import { app } from 'electron';
import path from 'path';
import fs from 'fs';

export const setupFileHandlers = (ipcMain) => {
  ipcMain.handle('read-folder', async () => {
    console.log('read-folder handler called');
    const resourcePath = path.join(
      app.isPackaged ? process.resourcesPath : process.cwd(),
      'resources',
      'data'
    );
    
    try {
      console.log('Attempting to read directory:', resourcePath);
      const files = await fs.promises.readdir(resourcePath);
      console.log('Files found:', files);
      return files;
    } catch (error) {
      console.error('Error reading folder:', error);
      if (error.code === 'ENOENT') {
        try {
          await fs.promises.mkdir(resourcePath, { recursive: true });
          console.log('Created directory:', resourcePath);
          return [];
        } catch (mkdirError) {
          console.error('Error creating directory:', mkdirError);
          throw mkdirError;
        }
      }
      throw error;
    }
  });

  ipcMain.handle('save-file', async (_event, { content, filename }) => {
    const filePath = path.join(app.getPath('userData'), filename);
    await fs.promises.writeFile(filePath, content);
    return true;
  });
}; 