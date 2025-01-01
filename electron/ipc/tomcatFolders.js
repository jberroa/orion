import { app } from 'electron';
import path from 'path';
import fs from 'fs';

const initializeTomcatFolders = async () => {
  try {
    const basePath = path.join(app.getPath('userData'), 'tomcats');
    
    // Create base tomcat directory if it doesn't exist
    if (!fs.existsSync(basePath)) {
      console.log("Creating base tomcat directory:", basePath);
      await fs.promises.mkdir(basePath, { recursive: true });
    }
    
    for (let i = 1; i <= 5; i++) {
      const tomcatPath = path.join(basePath, `Tomcat${i}`);
      console.log(`Processing Tomcat${i} directory:`, tomcatPath);
      
      // Create folder if it doesn't exist
      if (!fs.existsSync(tomcatPath)) {
        console.log(`Creating Tomcat${i} directory`);
        await fs.promises.mkdir(tomcatPath, { recursive: true });
      } else {
        // Clear existing contents
        console.log(`Clearing contents of Tomcat${i} directory`);
        try {
          const files = await fs.promises.readdir(tomcatPath);
          for (const file of files) {
            const filePath = path.join(tomcatPath, file);
            await fs.promises.rm(filePath, { recursive: true, force: true });
          }
        } catch (clearError) {
          console.error(`Error clearing Tomcat${i} directory:`, clearError);
          throw clearError;
        }
      }
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