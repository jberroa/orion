import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const setupGitHandlers = (ipcMain) => {
  ipcMain.handle('get-git-branches', async (_, gitUrl) => {
    try {
      // Use git ls-remote to get all refs without cloning
      const { stdout } = await execAsync(`git ls-remote --heads ${gitUrl}`);
      
      // Parse and clean branch names
      // Format of ls-remote output is: <hash> refs/heads/<branch-name>
      const branches = stdout
        .split('\n')
        .filter(line => line.includes('refs/heads/'))
        .map(line => line.split('refs/heads/')[1])
        .filter(branch => branch && !branch.includes('HEAD'));

      return branches;
    } catch (error) {
      console.error('Error fetching git branches:', error);
      throw error;
    }
  });
};

