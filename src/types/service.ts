export interface Service {
  id: string;
  name: string;
  gitUrl: string;
  folder: string;
  tomcatNumber: number;
  tokenName: string;
  webPath: string;
  warPath: string;
  path: string;
  port: number;
  branch: string;
  javaVersion: 7 | 8 | 17 ;
  enabled: boolean;
  favorite: boolean;
  description: string;
  buildParams: string;
  parentRepo: string;
  parentFolder: string;
  subRepo: boolean;
}

export interface ServiceSection {
  allServices: Service[];
  favorites: Service[];
  enabled: Service[];
}
