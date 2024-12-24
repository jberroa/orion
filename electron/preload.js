const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script is running');

// Expose protected methods that allow the renderer process to use
// specific electron APIs without exposing the entire API
contextBridge.exposeInMainWorld(
    'electron', {
        // We can expose functions, values, or objects
        invoke: function(channel, ...args) {
            console.log('Invoke called with channel:', channel);
            const validChannels = ['read-folder'];
            if (validChannels.includes(channel)) {
                return ipcRenderer.invoke(channel, ...args);
            }
            return Promise.reject(new Error('Invalid channel'));
        }
    }
)

console.log('Electron API exposed'); 