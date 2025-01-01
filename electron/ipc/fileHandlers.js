import { app } from "electron";
import path from 'path';
import { replaceInFile } from 'replace-in-file';
import fs from 'fs';
import fsExtra from 'fs-extra';
import {config} from '../../src/data/config.js'
import { getMachineConfig } from '../../src/data/config.js'
import { tokenReplacements } from "../../resources/tokens/tokenReplacements.js";
import { dialog } from 'electron';

// Recreate __dirname

export const ensureSettingsFile = async () => {
  try {
    const userDataPath = app.getPath("userData");
    const configPath = path.join(userDataPath, "settings.json");
    
    if (!fs.existsSync(configPath)) {
      console.log("Creating initial settings file...");
      const defaultSettings = {
        repoPath: "",
        maxLogLength: 1000,
        masterUsername: "",
        masterPassword: "",
        instanceUsername: "",
        instancePassword: "",
        selectedQABox: "",
        theme: "system",
        services: {
          favorites: [],    // Array of service IDs that are favorited
          enabled: []       // Array of service IDs that are enabled
        }
      };
      
      await fs.promises.mkdir(userDataPath, { recursive: true });
      await fs.promises.writeFile(configPath, JSON.stringify(defaultSettings, null, 2));
      console.log("Initial settings file created");
      return defaultSettings;
    }
    
    return null;
  } catch (error) {
    console.error("Error ensuring settings file:", error);
    throw error;
  }
};

const getSettings = async () => {
  try {
    const defaultSettings = await ensureSettingsFile();
    if (defaultSettings) {
      return defaultSettings;
    }

    const userDataPath = app.getPath("userData");
    const configPath = path.join(userDataPath, "settings.json");
    const settings = JSON.parse(await fs.promises.readFile(configPath, 'utf8'));
    
    return {
      ...settings,
      services: settings.services || { favorites: [], enabled: [] },
      repoPath: settings.repoPath || "",
      maxLogLength: settings.maxLogLength || 1000,
      masterUsername: settings.masterUsername || "",
      masterPassword: settings.masterPassword || "",
      instanceUsername: settings.instanceUsername || "",
      instancePassword: settings.instancePassword || "",
      selectedQABox: settings.selectedQABox || "",
      theme: settings.theme || "system",
    };
  } catch (error) {
    console.error("Error reading settings:", error);
    return {
      repoPath: "",
      maxLogLength: 1000,
      masterUsername: "",
      masterPassword: "",
      instanceUsername: "",
      instancePassword: "",
      selectedQABox: "",
      services: { favorites: [], enabled: [] }
    };
  }
};

const saveSettings = async (settings) => {
  try {
    const userDataPath = app.getPath("userData");
    const configPath = path.join(userDataPath, "settings.json");
    await fs.promises.writeFile(configPath, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving settings:", error);
    return false;
  }
};

export const setupFileHandlers = (ipcMain) => {
  ipcMain.handle("create-properties-files", async (_, services) => {
    console.log("create-properties-files handler called");
    const settings = await getSettings();
    const qaBox = settings.selectedQABox;
    
    const resourcePath = path.join(
      app.isPackaged ? process.resourcesPath : process.cwd(),
      "resources",
      "conf"
    );

    const machine = getMachineConfig(qaBox);
    const files = [];

    if (fs.existsSync(resourcePath)) {
      let pathToConfFiles = fs.readdirSync(resourcePath);
      let suffix = ".mustache";
      let suffixLen = suffix.length;
      let mustacheFiles = pathToConfFiles.filter((elm) => elm.endsWith(suffix));

      for (let i = 0; i < mustacheFiles.length; ++i) {
        let filename = path.join(resourcePath, mustacheFiles[i]);
        let stat = fs.lstatSync(filename);
        if (!stat.isDirectory()) {
          let destPath = filename.slice(0, -1 * suffixLen);
          fsExtra.copySync(filename, destPath);
          files.push(destPath);
        }
      }
    }

    let tokenArray = tokenReplacements.map((a) => a.token);
    let replacementArray = tokenReplacements.map((a) => {
      if (typeof a.replacement === "string") return a.replacement;
      return a.replacement(config, machine, services);
    });

    try {
      const options = {
        files: files,
        from: tokenArray,
        to: replacementArray,
      };
      let changes = await replaceInFile(options);
      console.log("Modified files:", changes.join(", "));
      console.log("Attempting to read directory:", resourcePath);

      const filesw = await fs.promises.readdir(resourcePath);
      console.log("Files found:", filesw);
      return filesw;
    } catch (error) {
      console.error("Error creating properties files:", error);
      if (error.code === "ENOENT") {
        try {
          await fs.promises.mkdir(resourcePath, { recursive: true });
          console.log("Created directory:", resourcePath);
          return [];
        } catch (mkdirError) {
          console.error("Error creating directory:", mkdirError);
          throw mkdirError;
        }
      }
      throw error;
    }
  });

  ipcMain.handle("save-file", async (_event, { content, filename }) => {
    const filePath = path.join(app.getPath("userData"), filename);
    await fs.promises.writeFile(filePath, content);
    return true;
  });

  ipcMain.handle("select-directory", async () => {
    console.log("select-directory handler called");
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
      });
      
      console.log("Dialog result:", result);
      if (!result.canceled) {
        return result.filePaths[0];
      }
      return null;
    } catch (error) {
      console.error("Error in select-directory:", error);
      throw error;
    }
  });

  ipcMain.handle("get-settings", async () => {
    return await getSettings();
  });

  ipcMain.handle("save-settings", async (_, settings) => {
    return await saveSettings(settings);
  });

  ipcMain.on('get-settings-sync', (event) => {
    try {
      const userDataPath = app.getPath("userData");
      const configPath = path.join(userDataPath, "settings.json");
      if (fs.existsSync(configPath)) {
        const settings = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        event.returnValue = settings;
      } else {
        event.returnValue = { theme: 'system' };
      }
    } catch (error) {
      console.error('Error reading settings:', error);
      event.returnValue = { theme: 'system' };
    }
  });
};