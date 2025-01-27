import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const setupGitHandlers = (ipcMain) => {
  ipcMain.handle('get-git-branches', async (_, gitUrl) => {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Git operation timed out after 6 seconds')), 6000);
      });

      const { stdout } = await Promise.race([
        execAsync(`git ls-remote --heads ${gitUrl}`),
        timeoutPromise
      ]);
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

