import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';

const initializeTomcatFolders = async () => {
  try {
    // Get settings from app's user data path
    const settings = JSON.parse(
      await fsPromises.readFile(path.join(app.getPath('userData'), 'settings.json'), 'utf-8')
    );

    const repoPath = settings.repoPath;
    const bhTomcatPath = path.join(repoPath, 'bh-tomcat');
    const tomcatPath = path.join(repoPath, 'tomcat');

    // Check if bh-tomcat exists in repo path
    if (fs.existsSync(bhTomcatPath)) {
      // Rename bh-tomcat to tomcat
      await fsPromises.rename(bhTomcatPath, tomcatPath);
    } else if (!fs.existsSync(tomcatPath)) {
      throw new Error('Neither bh-tomcat nor tomcat directory exists in repository path');
    }

    return true;
  } catch (error) {
    console.error("Error in initializeTomcatFolders:", error);
    throw error;
  }
};

export const setupTomcatFoldersHandlers = (ipcMain) => {
  ipcMain.handle('initialize-tomcat-folders', async () => {
    try {
      await initializeTomcatFolders();
      return true;
    } catch (error) {
      console.error('Error handling initialize-tomcat-folders:', error);
      throw error;
    }
  });
};