import { app } from "electron";
import path from 'path';
import { replaceInFile } from 'replace-in-file';
import fs from 'fs';
import fsExtra from 'fs-extra';
import {config} from '../../src/data/config.js'
import { getMachineConfig } from '../../src/data/config.js'
import { tokenReplacements } from "../../resources/tokens/tokenReplacements.js";

// Recreate __dirname




export const setupFileHandlers = (ipcMain) => {
  ipcMain.handle("read-folder", async (qaBox, services) => {
    console.log("read-folder handler called");
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
      console.error("Error reading folder:", error);
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
};

