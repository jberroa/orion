export interface IElectronAPI {
  invoke(channel: 'read-folder', string, object): Promise<string[]>;
  invoke(channel: 'fetch-data', any): Promise<>;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}

export {}; 