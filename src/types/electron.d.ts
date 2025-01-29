declare global {
  interface Window {
    electron: {
      invoke(channel: 'build-local-services', enabled: Service[], skipTests: boolean, forceUpdate: boolean): Promise<void>;
      invoke(channel: 'save-settings', settings: Record<string, any>): Promise<void>;
      invoke(channel: 'get-container-logs', tomcatId: number): Promise<string>;
      invoke(channel: 'get-git-branches', gitUrl: string): Promise<string[]>;
      invoke(channel: 'get-container-statuses'): Promise<Record<number, 'stopped' | 'running'>>;
      invoke(channel: 'get-settings'): Promise<{
        repoPath: string;
        maxLogLength: number;
        masterUsername: string;
        masterPassword: string;
        instanceUsername: string;
        instancePassword: string;
        selectedQABox?: string;
        services: Service[];
        theme: string;
        jenkinsUsername: string;
        jenkinsApiToken: string;
      }>;
      invoke(channel: 'kill-docker-containers'): Promise<void>;
      invoke(channel: 'select-directory'): Promise<string | null>;
      invoke(channel: 'fetch-data', data: { url: string, username: string, apiToken: string }): Promise<{ ok: boolean, data?: any, error?: string }>;
      invoke(channel: 'initialize-tomcat-folders'): Promise<void>;
      invoke(channel: 'download-remote-services', enabled: Service[]): Promise<void>;
      invoke(channel: 'copy-war-files', enabled: Service[]): Promise<void>;
      invoke(channel: 'create-properties-files', services: {
        allServices: Service[];
        enabled: Service[];
    }): Promise<string[]>;
      invoke(channel: 'start-tomcat-containers', { tomcatNumbers, paths }): Promise<void>;
      on: (channel: string, callback: (data: any) => void) => void;
    };
  }
}

export {};