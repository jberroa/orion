import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { spawn } from 'child_process';
import { app } from 'electron';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCKER_IMAGE = 'bullhorn/multi-java';
const BUILD_CONTAINER = 'bullhorn-multi-java-builder';

async function ensureBuildContainers(repoPath) {
  try {
    // Check if repoPath exists first
    try {
      await fs.access(repoPath);
    } catch (error) {
      throw new Error(`Repository path ${repoPath} does not exist`);
    }

    // Check if the custom image exists
    const { stdout: images } = await execAsync(`podman images ${DOCKER_IMAGE} --format "{{.Repository}}"`);
    if (!images.includes(DOCKER_IMAGE)) {
      console.log('Building custom Maven multi-Java image...');
      try {
        // Point to the docker directory for the build context
        const dockerContext = path.join(dirname(__filename), '..', '..', 'docker');
        await execAsync(`podman build -t ${DOCKER_IMAGE} -f "${dockerContext}/Dockerfile" "${dockerContext}"`);
        console.log('Successfully built custom Maven multi-Java image');
      } catch (error) {
        throw new Error(`Failed to build Docker image: ${error.message}`);
      }
    }

    // Check if container exists using docker
    const { stdout: existingContainers } = await execAsync('podman ps -a --format "{{.Names}}"');
    const existingList = existingContainers.split('\n').filter(Boolean);

    if (!existingList.includes(BUILD_CONTAINER)) {
      // Create the container
      await execAsync(`podman create \
        --name ${BUILD_CONTAINER} \
        --network host \
        -v maven-repo:/root/.m2 \
        -v ${repoPath}:/workspace \
        ${DOCKER_IMAGE} \
        tail -f /dev/null`);

      // Start the container
      await execAsync(`podman start ${BUILD_CONTAINER}`);
      console.log('Created multi-Java build container');
    }

    // Set permissions on the repository path
    try {
      await execAsync(`chmod -R u+rw "${repoPath}"`);
    } catch (error) {
      console.warn('Warning: Could not set permissions on repo path:', error);
    }

  } catch (error) {
    console.error('Error ensuring build container:', error);
    throw error;
  }
}

const buildWarLocally = async (service, repoPath, event, skipTests, forceUpdate) => {
  try {
    // Check if repoPath exists
    try {
      await fs.access(repoPath);
    } catch (error) {
      throw new Error(`Repository path ${repoPath} does not exist`);
    }

    const serviceRepoPath = path.join(repoPath, service.folder);
    const javaVersion = service.javaVersion || 8;

    // Set JAVA_HOME based on version
    const javaHome = javaVersion === 8 ? '/opt/java/temurin-8-jdk' : '/opt/java/openjdk';

    // Pass repoPath to ensureBuildContainers
    await ensureBuildContainers(repoPath);

    // Start the container if it's not running
    try {
      await execAsync(`podman start ${BUILD_CONTAINER}`);
    } catch (error) {
      console.error(`Error starting container ${BUILD_CONTAINER}:`, error);
      // If start fails, try to recreate the container
      await ensureBuildContainers(repoPath);
      await execAsync(`podman start ${BUILD_CONTAINER}`);
    }

    // Execute maven build in the container
    const buildString = `pwd && ls && env && \
    cd /workspace/${service.subRepo ? service.parentFolder : service.folder} && \
    mvn package ${service.buildParams ?? ''} \
    -DskipBuildInfo \
    ${skipTests ? '-Dmaven.test.skip' : ''} \
    ${forceUpdate ? '-U' : ''} \
    ${service.subRepo ? `-am -pl ${service.folder}` : ''}`;

    const buildCommand = [
      'docker', 'exec',
      '-w', `/workspace/`,
      '-e', `JAVA_HOME=${javaHome}`,
      BUILD_CONTAINER,
      '/bin/sh', '-c',
      buildString
    ];

    console.log(buildCommand);

    return new Promise((resolve, reject) => {
      const buildProcess = spawn(buildCommand[0], buildCommand.slice(1), {
        env: {
          PATH: process.env.PATH,
          HOME: process.env.HOME,
          MAVEN_OPTS: '-Xmx1024m'
        }
      });

      let buildSuccess = false;
      let logBuffer = '';
      let lastSendTime = Date.now();
      const BATCH_INTERVAL = 100; // Send logs every 100ms

      const sendBufferedLogs = () => {
        if (logBuffer) {
          event.sender.send('build-log', { stepId: 'local', log: logBuffer });
          logBuffer = '';
          lastSendTime = Date.now();
        }
      };

      buildProcess.stdout.on('data', (data) => {
        const log = data.toString();
        console.log(log);
        
        // Check for build success message
        if (log.includes('BUILD SUCCESS')) {
          buildSuccess = true;
        }

        // Append to buffer instead of sending immediately
        logBuffer += log;

        // Send buffered logs if enough time has passed
        if (Date.now() - lastSendTime >= BATCH_INTERVAL) {
          sendBufferedLogs();
        }
      });

      buildProcess.stderr.on('data', (data) => {
        const log = data.toString();
        console.log(log);
        
        // Append to buffer instead of sending immediately
        logBuffer += log;

        // Send buffered logs if enough time has passed
        if (Date.now() - lastSendTime >= BATCH_INTERVAL) {
          sendBufferedLogs();
        }
      });

      buildProcess.on('close', (code) => {
        // Send any remaining logs
        sendBufferedLogs();
        
        if (code === 0 && buildSuccess) {
          resolve({ success: true, serviceName: service.id });
        } else {
          reject(new Error(`Maven build failed for service ${service.id}`));
        }
      });

      buildProcess.on('error', (error) => {
        sendBufferedLogs();
        reject(error);
      });
    });
  } catch (error) {
    console.error(`Error building war for ${service.id}:`, error);
    event.sender.send('build-log', { 
      stepId: 'local', 
      log: `Error: ${error.message}` 
    });
    throw error;
  }
};

async function startTomcatContainers(tomcatNumbers, paths) {
  try {
    const { repoPath } = paths;
    
    // Convert tomcat numbers array to container names
    const containerNames = tomcatNumbers.map(num => `tomcat${num}`).join(' ');
    const confPath = path.join(
      app.isPackaged ? process.resourcesPath : process.cwd(),
      "resources",
      "conf"
    );

    const dockerComposePath = path.join(
      app.isPackaged ? process.resourcesPath : process.cwd(),
      "docker",
      "docker-compose.yml"
    );
    
    // Construct and execute the docker-compose command
    const command = `PATH_TO_REPOS=${repoPath} PATH_TO_CONF=${confPath} podman compose -f ${dockerComposePath} up -d ${containerNames}`;
    
    const { stdout, stderr } = await execAsync(command);
    console.log('Docker-compose output:', stdout);
    
    if (stderr) {
      console.warn('Docker-compose stderr:', stderr);
    }
    
    return true;
  } catch (error) {
    console.error('Error starting Tomcat containers:', error);
    throw error;
  }
}

export const setupDockerHandlers = (ipcMain) => {

  ipcMain.handle('build-local-services', async (event, enabledServices, skipTests, forceUpdate) => {
    try {
      // Wait for app to be ready
      if (!app.isReady()) {
        await new Promise(resolve => app.once('ready', resolve));
      }

      const settings = JSON.parse(
        await fs.readFile(path.join(app.getPath('userData'), 'settings.json'), 'utf-8')
      );

      if (!settings.repoPath) {
        throw new Error('Repository path is not configured in settings');
      }

      const localServices = enabledServices.filter(service => service.branch === 'local');
      const results = [];
      
      // Build each service and collect results
      for (const service of localServices) {
        try {
          const result = await buildWarLocally(service, settings.repoPath, event, skipTests, forceUpdate);
          results.push(result);
        } catch (error) {
          results.push({ 
            success: false, 
            serviceName: service.id, 
            error: error.message 
          });
        }
      }

      // Check if all builds were successful
      const allSucceeded = results.every(result => result.success);
      const failedServices = results.filter(result => !result.success)
                                  .map(result => result.serviceName);

      return {
        success: allSucceeded,
        results,
        failedServices,
      };
    } catch (error) {
      console.error('Error building local services:', error);
      throw error;
    }
  });

  ipcMain.handle('kill-docker-containers', async () => {
    try {
      await execAsync('podman kill $(docker ps -q)');
      return true;
    } catch (error) {
      // If the error is "must provide at least one name or id", it means no containers are running
      if (error.stderr?.includes('you must provide at least one name or id')) {
        return true;
      }
      console.error('Error killing containers:', error);
      throw error;
    }
  });

  ipcMain.handle('get-container-logs', async (event, tomcatId) => {
    try {
      const containerName = `tomcat${tomcatId}`;
      
      // Simply get the last 1000 lines each time
      const { stdout: logs } = await execAsync(
        `podman logs --follow=false --tail 1000 ${containerName}`
      );

      return logs || 'No logs available';
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

  ipcMain.handle('start-tomcat-containers', async (event, { tomcatNumbers, paths }) => {
    try {
      const result = await startTomcatContainers(tomcatNumbers, paths);
      return result;
    } catch (error) {
      console.error('Error in start-tomcat-containers handler:', error);
      throw error;
    }
  });
};