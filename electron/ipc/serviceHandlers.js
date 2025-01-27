import { app } from 'electron';
import path from 'path';
import axios from 'axios';
import fs from 'fs/promises';
import { exec } from 'child_process';


const generateArtifactoryUrl = (serviceName, branch, baseUrl, gitlabEnabled = false) => {
  const TAG_REGEX = /^\d+\.\d+\.\d+$/;  // Assuming this is the tag regex pattern
  let cleanBranchName;
  let finalBaseUrl = baseUrl;

  if (TAG_REGEX.test(branch)) {
    cleanBranchName = branch;
    finalBaseUrl = baseUrl.replace('bh-snapshots', 'bh-releases');
  } else {
    if (gitlabEnabled) {
      cleanBranchName = `${branch.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-SNAPSHOT`;
    } else {
      cleanBranchName = `${branch.replace(/\//g, '_')}-SNAPSHOT`;
    }
  }

  return `${finalBaseUrl}/${serviceName}/${cleanBranchName}/${serviceName}-${cleanBranchName}.war`;
};

const downloadRemoteServices = async (services, stepId) => {
  try {
    const log = (message) => {
      global.mainWindow.webContents.send('step-log', { stepId, message });
    };

    log('Starting remote services download...');
    const settings = await getSettings();
    const tomcatBasePath = path.join(app.getPath('userData'), 'tomcats');
    
    for (const service of services) {
      if (service.branch === 'local') {
        log(`Skipping local service: ${service.name}`);
        continue;
      }

      log(`Downloading service: ${service.name}`);
      const warUrl = generateArtifactoryUrl(
        service.name,
        service.branch,
        settings.artifactoryBaseUrl,
        settings.gitlabEnabled
      );

      const tomcatPath = path.join(tomcatBasePath, `Tomcat${service.tomcatNumber}`);
      const warDestPath = path.join(tomcatPath, `${service.name}.war`);

      // Ensure the directory exists
      await fs.mkdir(tomcatPath, { recursive: true });

      // Download the file
      const response = await axios({
        method: 'GET',
        url: warUrl,
        responseType: 'arraybuffer'
      });

      // Save the file
      await fs.writeFile(warDestPath, response.data);
      log(`Successfully downloaded ${service.name} to ${warDestPath}`);
    }
    
    return true;
  } catch (error) {
    log('Error in downloadRemoteServices: ' + error.message);
    throw error;
  }
};

const copyWarFiles = async (services, event, stepId) => {
  try {
    let logBuffer = '';
    let lastSendTime = Date.now();
    const BATCH_INTERVAL = 100; // Send logs every 100ms

    const sendBufferedLogs = () => {
      if (logBuffer) {
        event.sender.send('build-log', { stepId, log: logBuffer });
        logBuffer = '';
        lastSendTime = Date.now();
      }
    };

    const log = (message) => {
      console.log(message); // Keep console logging for debugging
      logBuffer += message + '\n';
      
      // Send buffered logs if enough time has passed
      if (Date.now() - lastSendTime >= BATCH_INTERVAL) {
        sendBufferedLogs();
      }
    };

    log('Starting WAR files copy...');
    
    // Get settings from app's user data path
    const settings = JSON.parse(
      await fs.readFile(path.join(app.getPath('userData'), 'settings.json'), 'utf-8')
    );
    
    // Check for tomcat directories
    let hasTomcat10 = false;
    let hasTomcat = false;

    try {
      await fs.access(path.join(settings.repoPath, 'tomcat10'));
      hasTomcat10 = true;
    } catch (error) {
      // Clone tomcat10 if it doesn't exist
      log('Tomcat10 not found, cloning repository...');
      try {
        await exec(
          `git clone git@bhsource.bullhorn.com:QA_ENVIRONMENTS/bh-tomcat10.git tomcat10`,
          { cwd: settings.repoPath }
        );
        hasTomcat10 = true;
        log('Successfully cloned tomcat10 repository');
      } catch (cloneError) {
        log('Failed to clone tomcat10: ' + cloneError.message);
        throw new Error('Failed to clone tomcat10 repository');
      }
    }

    try {
      // Check for either bh-tomcat or tomcat
      await Promise.any([
        fs.access(path.join(settings.repoPath, 'bh-tomcat')),
        fs.access(path.join(settings.repoPath, 'tomcat'))
      ]);
      hasTomcat = true;
    } catch (error) {
      // Clone bh-tomcat if neither exists
      log('Tomcat not found, cloning repository...');
      try {
        await exec(
          `git clone git@bhsource.bullhorn.com:QA_ENVIRONMENTS/bh-tomcat.git tomcat`,
          { cwd: settings.repoPath }
        );
        hasTomcat = true;
        log('Successfully cloned tomcat repository');
      } catch (cloneError) {
        log('Failed to clone tomcat: ' + cloneError.message);
        throw new Error('Failed to clone tomcat repository');
      }
    }

    if (!hasTomcat10 || !hasTomcat) {
      throw new Error('Required Tomcat directories not found in repository path');
    }

    log('Found required Tomcat directories');
    
    for (const service of services) {
      log(`Copying WAR files for service: ${service.name}`);
      
      // Determine source path using warpath from service
      const sourceWarPath = path.join(settings.repoPath, service.warPath + '.war');
      
      // Check if source WAR file exists
      try {
        await fs.access(sourceWarPath);
      } catch (error) {
        log(`Source WAR file not found for ${service.name} at ${sourceWarPath}`);
        throw new Error(`Source WAR file not found for ${service.name}`);
      }
      
      // Determine destination path based on tomcat number
      let destBasePath;
      if (service.tomcatNumber >= 1 && service.tomcatNumber <= 3) {
        // Try bh-tomcat first, fall back to tomcat
        try {
          await fs.access(path.join(settings.repoPath, 'bh-tomcat'));
          destBasePath = path.join(settings.repoPath, 'bh-tomcat');
        } catch {
          destBasePath = path.join(settings.repoPath, 'tomcat');
        }
      } else if (service.tomcatNumber >= 4 && service.tomcatNumber <= 5) {
        destBasePath = path.join(settings.repoPath, 'tomcat10');
      } else {
        throw new Error(`Invalid tomcat number: ${service.tomcatNumber}`);
      }

      const destWarPath = path.join(
        destBasePath,
        `instance${service.tomcatNumber}`,
        'webapps',
        `${service.webPath}.war`
      );

      // Ensure the webapps directory exists
      await fs.mkdir(path.dirname(destWarPath), { recursive: true });

      // Copy the WAR file
      try {
        await fs.copyFile(sourceWarPath, destWarPath);
        log(`Successfully copied ${service.name} WAR to ${destWarPath}`);
      } catch (copyError) {
        log(`Failed to copy WAR file for ${service.name}: ${copyError.message}`);
        throw new Error(`Failed to copy WAR file for ${service.name}`);
      }
    }
    
    // Send any remaining logs before returning
    sendBufferedLogs();
    return true;
  } catch (error) {
    console.error('Error in copyWarFiles:', error);
    event.sender.send('build-log', { 
      stepId, 
      log: `Error: ${error.message}` 
    });
    throw error;
  }
};

export const setupServiceHandlers = (ipcMain) => {
  ipcMain.handle('download-remote-services', async (_, services, stepId) => {
    try {
      await downloadRemoteServices(services, stepId);
      return true;
    } catch (error) {
      console.error('Error handling download-remote-services:', error);
      throw error;
    }
  });

  ipcMain.handle('copy-war-files', async (event, services, stepId) => {
    try {
      await copyWarFiles(services, event, stepId);
      return true;
    } catch (error) {
      console.error('Error handling copy-war-files:', error);
      throw error;
    }
  });
};