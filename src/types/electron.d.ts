export interface IElectronAPI {
  invoke(channel: 'read-folder'): Promise<string[]>;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}

export {}; 