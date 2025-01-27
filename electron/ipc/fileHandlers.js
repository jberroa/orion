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
    };
  }
};

const saveSettings = async (settings) => {
  const userDataPath = app.getPath("userData");
  const configPath = path.join(userDataPath, "settings.json");
  
  // First, read the existing settings as backup
  let previousSettings;
  try {
    previousSettings = JSON.parse(await fs.promises.readFile(configPath, 'utf8'));
  } catch (error) {
    console.error("Error reading previous settings for backup:", error);
    previousSettings = null;
  }

  // Log the settings object we're trying to save
  console.log("Attempting to save settings:", JSON.stringify(settings, null, 2));

  try {
    await fs.promises.writeFile(configPath, JSON.stringify(settings, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving settings:", error);
    
    // Attempt to restore previous settings if we have them
    if (previousSettings) {
      try {
        console.log("Attempting to restore previous settings...");
        await fs.promises.writeFile(configPath, JSON.stringify(previousSettings, null, 2));
        console.log("Successfully restored previous settings");
      } catch (restoreError) {
        console.error("Error restoring previous settings:", restoreError);
      }
    }
    
    return false;
  }
};

const processRepoForTokens = (tokenArray, replacementArray, repo, tomcatNumber, machine, selectedPackages) => {
    if (repo.tokenName) {
        tokenArray.push(new RegExp('{{' + repo.tokenName + '}}', 'g'));

        let tokenValue = 'UNKNOWN';
        if (tomcatNumber === 1) {
            tokenValue = `http://${machine.tomcat1}/${repo.webPath}`;
        } else if (tomcatNumber === 2) {
            tokenValue = `http://${machine.tomcat2}/${repo.webPath}`;
        } else if (tomcatNumber === 3) {
            tokenValue = `http://${machine.tomcat3}/${repo.webPath}`;
        } else if (tomcatNumber === 4) {
            tokenValue = `http://${machine.tomcat4}/${repo.webPath}`;
        } else if (tomcatNumber === 5) {
            tokenValue = `http://${machine.tomcat5}/${repo.webPath}`;
        }

        for (let i = 0; i < selectedPackages.length; i++) {
            let val = selectedPackages[i];
            if (val.name === repo.name) {
                if (tomcatNumber === 1) {
                    tokenValue = `http://${config.tomcat.instance1.server}:${config.tomcat.instance1.port}/${repo.webPath}`
                } else if (tomcatNumber === 2) {
                    tokenValue = `http://${config.tomcat.instance2.server}:${config.tomcat.instance2.port}/${repo.webPath}`
                } else if (tomcatNumber === 3) {
                    tokenValue = `http://${config.tomcat.instance3.server}:${config.tomcat.instance3.port}/${repo.webPath}`
                } else if (tomcatNumber === 4) {
                    tokenValue = `http://${config.tomcat.instance4.server}:${config.tomcat.instance4.port}/${repo.webPath}`
                } else if (tomcatNumber === 5) {
                    tokenValue = `http://${config.tomcat.instance5.server}:${config.tomcat.instance5.port}/${repo.webPath}`
                }
                break;
            }
        }

        replacementArray.push(tokenValue);
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
      return a.replacement(config, machine, services.enabled);
    });

    services.allServices.forEach(service => {
      processRepoForTokens(tokenArray, replacementArray, service, service.tomcatNumber, machine, services.enabled);
    })


    try {
      const options = {
        files: files,
        from: tokenArray,
        to: replacementArray,
      };
      let changes = await replaceInFile(options);
      //console.log("Modified files:", changes.join(", "));
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