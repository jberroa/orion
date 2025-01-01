export type ServiceCategory = "core" | "integration" | "worker" | "data"

export interface Service {
  id: string;
  name: string;
  path: string;
  port: number;
  branch: string;
  javaVersion: '8' | '11' | '17' | '21';
  title: string
  category: ServiceCategory
  enabled: boolean
  favorite: boolean
  description: string
  lastUpdated: Date
  tags: string[]
  // New properties
  gitUrl: string
  folder: string
  tomcatNumber: number
  buildParams: Record<string, string>
  parentRepo: string
  tokenName: string
  webPath: string
  warPath: string
}

export interface ServiceSection {
  allServices: Service[]
  favorites: Service[]
  enabled: Service[]
} 