import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { spawn } from 'child_process';
import { app } from 'electron';

const execAsync = promisify(exec);

const BUILD_CONTAINERS = {
  '8': 'maven-builder-java8',
  '11': 'maven-builder-java11',
  '17': 'maven-builder-java17'
};

async function ensureBuildContainers(repoPath) {
  try {
    // Check if repoPath exists first
    try {
      await fs.access(repoPath);
    } catch (error) {
      throw new Error(`Repository path ${repoPath} does not exist`);
    }

    // Check which containers exist using podman
    const { stdout: existingContainers } = await execAsync('podman ps -a --format "{{.Names}}"');
    const existingList = existingContainers.split('\n').filter(Boolean);

    for (const [version, containerName] of Object.entries(BUILD_CONTAINERS)) {
      if (!existingList.includes(containerName)) {
        // Create the container if it doesn't exist
        // Add --privileged and use :z instead of :Z for more relaxed SELinux labeling
        await execAsync(`podman create \
          --name ${containerName} \
          --privileged \
          -v maven-repo:/root/.m2:z \
          -v ${repoPath}:/workspace:z \
          --user $(id -u):$(id -g) \
          docker.io/azul/zulu-openjdk:${version}-latest`);
        
        console.log(`Created build container for Java ${version}`);
      } else {
        // Remove existing container and recreate it
        try {
          await execAsync(`podman rm -f ${containerName}`);
          await execAsync(`podman create \
            --name ${containerName} \
            --privileged \
            -v maven-repo:/root/.m2:z \
            -v ${repoPath}:/workspace:z \
            --user $(id -u):$(id -g) \
            docker.io/azul/zulu-openjdk:${version}-latest`);
        } catch (error) {
          console.error(`Error recreating container ${containerName}:`, error);
          throw error;
        }
      }
    }

    // Set permissions on the repository path
    try {
      await execAsync(`chmod -R u+rw "${repoPath}"`);
    } catch (error) {
      console.warn('Warning: Could not set permissions on repo path:', error);
    }

  } catch (error) {
    console.error('Error ensuring build containers:', error);
    throw error;
  }
}

const buildWarLocally = async (service, repoPath) => {
  try {
    // Check if repoPath exists
    try {
      await fs.access(repoPath);
    } catch (error) {
      throw new Error(`Repository path ${repoPath} does not exist`);
    }

    const serviceRepoPath = path.join(repoPath, service.path);
    const javaVersion = service.javaVersion || '11';
    const containerName = BUILD_CONTAINERS[javaVersion];

    if (!containerName) {
      throw new Error(`Unsupported Java version: ${javaVersion}`);
    }

    // Pass repoPath to ensureBuildContainers
    await ensureBuildContainers(repoPath);

    // Start the container if it's not running
    try {
      await execAsync(`podman start ${containerName}`);
    } catch (error) {
      console.error(`Error starting container ${containerName}:`, error);
      // If start fails, try to recreate the container
      await ensureBuildContainers(repoPath);
      await execAsync(`podman start ${containerName}`);
    }

    // Execute maven build in the container with explicit permissions
    const buildCommand = [
      'podman', 'exec',
      '--user', `$(id -u):$(id -g)`,  // Run as current user
      '-w', `/workspace/${service.path}`,
      containerName,
      '/bin/sh', '-c',
      `mkdir -p /root/.m2 && mvn package -DskipBuildInfo -Dmaven.test.skip -T 4 -am -pl .`
    ];

    return new Promise((resolve, reject) => {
      const buildProcess = spawn(buildCommand[0], buildCommand.slice(1), {
        env: {
          ...process.env,
          MAVEN_OPTS: '-Xmx1024m'
        }
      });

      const logs = [];

      buildProcess.stdout.on('data', (data) => {
        const log = data.toString();
        logs.push(log);
        global.mainWindow.webContents.send('build-log', {
          serviceId: service.id,
          log: log
        });
      });

      buildProcess.stderr.on('data', (data) => {
        const log = data.toString();
        logs.push(log);
        global.mainWindow.webContents.send('build-log', {
          serviceId: service.id,
          log: log
        });
      });

      buildProcess.on('close', (code) => {
        if (code === 0) {
          resolve(logs);
        } else {
          reject(new Error(`Maven build failed with exit code ${code}`));
        }
      });

      buildProcess.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error(`Error building war for ${service.id}:`, error);
    throw error;
  }
};

export const setupDockerHandlers = (ipcMain) => {
  ipcMain.handle('build-local-services', async (event, enabledServices) => {
    try {
      // Wait for app to be ready
      if (!app.isReady()) {
        await new Promise(resolve => app.once('ready', resolve));
      }

      const settings = JSON.parse(
        await fs.readFile(path.join(app.getPath('userData'), 'settings.json'), 'utf-8')
      );

      // Add debug logging
      console.log('Settings loaded:', settings);
      console.log('Repository path:', settings.repoPath);

      if (!settings.repoPath) {
        throw new Error('Repository path is not configured in settings');
      }

      const localServices = enabledServices.filter(service => service.branch === 'local');
      
      for (const service of localServices) {
        await buildWarLocally(service, settings.repoPath);

        // Create temporary .env file for this service
        const serviceRepoPath = path.join(settings.repoPath, service.path);
        const warFile = path.join(serviceRepoPath, 'target', '*.war');
        const javaVersion = service.javaVersion || '11';
        const baseImage = `docker.io/tomcat:${javaVersion === '8' ? '8.5' : '9.0'}-jdk${javaVersion}`;

        const envFile = path.join(process.cwd(), 'docker', '.env');
        await fs.writeFile(
          envFile,
          `SERVICE_ID=${service.id}\n` +
          `WAR_FILE=${warFile}\n` +
          `PORT=${service.port}\n` +
          `BASE_IMAGE=${baseImage}`
        );

        // Use podman-compose instead of docker-compose
        await execAsync(
          `podman-compose -f docker/docker-compose.template.yml up -d --build`,
          { cwd: process.cwd() }
        );

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
      await execAsync('podman kill $(podman ps -q)');
      return true;
    } catch (error) {
      console.error('Error killing containers:', error);
      throw error;
    }
  });

  ipcMain.handle('get-container-logs', async (event, tomcatId) => {
    try {
      const { stdout: containerId } = await execAsync(
        `podman ps --filter "name=tomcat-${tomcatId}" --format "{{.ID}}"`
      );

      if (!containerId.trim()) {
        return 'No container found for this Tomcat instance';
      }

      const { stdout: logs } = await execAsync(
        `podman logs ${containerId.trim()} --tail 1000`
      );

      return logs;
    } catch (error) {
      console.error('Error fetching container logs:', error);
      throw error;
    }
  });

  ipcMain.handle('get-container-statuses', async () => {
    try {
      const { stdout } = await execAsync('podman ps --format "{{.Names}}"');
      const runningContainers = stdout.split('\n').filter(Boolean);
      
      const statuses = {
        1: 'stopped',
        2: 'stopped',
        3: 'stopped',
        4: 'stopped',
        5: 'stopped'
      };

      runningContainers.forEach(containerName => {
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