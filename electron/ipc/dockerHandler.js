import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const setupDockerHandlers = (ipcMain) => {
  ipcMain.handle('build-local-services', async (event, enabledServices) => {
    try {
      const settings = JSON.parse(
        await fs.readFile(path.join(process.cwd(), 'settings.json'), 'utf-8')
      );

      const localServices = enabledServices.filter(service => service.branch === 'local');
      
      for (const service of localServices) {
        // Build the war file locally
        await buildWarLocally(service, settings.repoPath);

        // Create temporary .env file for this service
        const serviceRepoPath = path.join(settings.repoPath, service.path);
        const warFile = path.join(serviceRepoPath, 'target', '*.war');
        const javaVersion = service.javaVersion || '11';
        const baseImage = `tomcat:${javaVersion === '8' ? '8.5' : '9.0'}-jdk${javaVersion}`;

        const envFile = path.join(process.cwd(), 'docker', '.env');
        await fs.writeFile(
          envFile,
          `SERVICE_ID=${service.id}\n` +
          `WAR_FILE=${warFile}\n` +
          `PORT=${service.port}\n` +
          `BASE_IMAGE=${baseImage}`
        );

        // Start the docker container using the template compose file
        await execAsync(
          `docker-compose -f docker/docker-compose.template.yml up -d --build`,
          { cwd: process.cwd() }
        );

        // Clean up the temporary .env file
        await fs.unlink(envFile).catch(console.error);
      }

      return { success: true };
    } catch (error) {
      console.error('Error building local services:', error);
      throw error;
    }
  });

  ipcMain.handle('kill-docker-containers', async () => {
    try {
      // Kill all running containers
      await execAsync('docker kill $(docker ps -q)');
      return true;
    } catch (error) {
      console.error('Error killing docker containers:', error);
      throw error;
    }
  });

  ipcMain.handle('get-container-logs', async (event, tomcatId) => {
    try {
      // Get container ID for the specific tomcat instance
      const { stdout: containerId } = await execAsync(
        `docker ps --filter "name=tomcat-${tomcatId}" --format "{{.ID}}"`
      );

      if (!containerId.trim()) {
        return 'No container found for this Tomcat instance';
      }

      // Get the logs
      const { stdout: logs } = await execAsync(
        `docker logs ${containerId.trim()} --tail 1000`
      );

      return logs;
    } catch (error) {
      console.error('Error fetching container logs:', error);
      throw error;
    }
  });

  // Add this to your IPC handlers
ipcMain.handle('get-container-statuses', async () => {
    try {
      const { exec } = require('child_process');
      const util = require('util');
      const execAsync = util.promisify(exec);
  
      // Get list of running containers
      const { stdout } = await execAsync('docker ps --format "{{.Names}}"');
      const runningContainers = stdout.split('\n').filter(Boolean);
      // Create status object
      const statuses = {
        1: 'stopped',
        2: 'stopped',
        3: 'stopped',
        4: 'stopped',
        5: 'stopped'
      };
  
      // Update status for running containers
      runningContainers.forEach(containerName => {
        // Assuming container names follow a pattern like "tomcat1", "tomcat2", etc.
        const match = containerName.match(/tomcat(\d)/);
        if (match) {
          const tomcatId = parseInt(match[1]);
          if (tomcatId in statuses) {
            statuses[tomcatId] = 'running';
          }
        }
      });
  
      return statuses;
    } catch (error) {
      console.error('Error getting container statuses:', error);
      throw error;
    }
  });
};

const buildWarLocally = async (service, repoPath) => {
  const serviceRepoPath = path.join(repoPath, service.path);
  
  try {
    // Execute Maven build using the maven wrapper if it exists, otherwise use maven
    const mvnCommand = fs.access(path.join(serviceRepoPath, 'mvnw'))
      .then(() => './mvnw')
      .catch(() => 'mvn');
    
    const cmd = await mvnCommand;
    await execAsync(`${cmd} clean package -DskipTests`, {
      cwd: serviceRepoPath
    });
  } catch (error) {
    console.error(`Error building war for ${service.id}:`, error);
    throw error;
  }
};