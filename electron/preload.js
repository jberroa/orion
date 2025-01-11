const { contextBridge, ipcRenderer } = require('electron');

// Initialize theme synchronously before anything else
const initTheme = () => {
  try {
    // Hide content initially
    document.documentElement.style.display = 'none';
    
    // Get settings synchronously (this is safe in preload)
    const settings = ipcRenderer.sendSync('get-settings-sync');
    let theme = settings?.theme || 'system';
    
    if (theme === 'system') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Apply theme
    document.documentElement.classList.add(theme);
    
    // Show content
    document.documentElement.style.display = '';
  } catch (error) {
    console.error('Failed to initialize theme:', error);
  }
};

// Run before anything else
document.addEventListener('DOMContentLoaded', initTheme);

// Then expose the API
contextBridge.exposeInMainWorld('electron', {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  on: (channel, callback) => {
    if (channel === 'build-log') {  // Whitelist the build-log channel
      ipcRenderer.on(channel, (_, data) => callback(data));
    }
  },
  // ... your other exposed methods
}); 