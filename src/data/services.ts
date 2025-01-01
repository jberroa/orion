import type { Service, ServiceCategory } from '@/types/service'

const createService = (
  title: string,
  category: ServiceCategory,
  config: Partial<{
    gitUrl: string,
    folder: string,
    tomcatNumber: number,
    buildParams: Record<string, string>,
    parentRepo: string,
    tokenName: string,
    webPath: string,
    warPath: string
  }> = {}
): Service => ({
  title,
  category,
  branch: 'local',
  enabled: false,
  favorite: false,
  description: "An AI powered developer platform that allows developer to create, store and manage.",
  lastUpdated: new Date(),
  tags: [category],
  // New properties with defaults
  gitUrl: config.gitUrl || "",
  folder: config.folder || "",
  tomcatNumber: config.tomcatNumber || 0,
  buildParams: config.buildParams || {},
  parentRepo: config.parentRepo || "",
  tokenName: config.tokenName || "",
  webPath: config.webPath || "",
  warPath: config.warPath || "",
  id: '',
  name: '',
  path: '',
  port: 0,
  javaVersion: '8'
})

export const initialServices: Service[] = [
  createService("Core Services", "core", {
    gitUrl: "https://github.com/quozd/awesome-dotnet.git",
    folder: "core-services",
    tomcatNumber: 8080,
    buildParams: {
      "JAVA_VERSION": "11",
      "MAVEN_OPTS": "-Xmx2g"
    },
    parentRepo: "main-repo",
    tokenName: "CORE_TOKEN",
    webPath: "/core",
    warPath: "/target/core.war"
  }),
  createService("Novo Integration", "integration", {
    gitUrl: "https://github.com/quozd/awesome-dotnet.git",
    folder: "novo-int",
    tomcatNumber: 8081,
    parentRepo: "integration-repo",
    tokenName: "NOVO_TOKEN",
    webPath: "/novo",
    warPath: "/target/novo.war"
  }),
  // Add configuration for other services...
  createService("Event Worker", "worker"),
  createService("Data Sync", "data"),
  createService("Canvas Services", "core"),
  createService("DataHub", "data"),
]