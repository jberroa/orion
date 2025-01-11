import type { Service } from "@/types/service";

const createService = (
  config: Partial<{
    name: string;
    gitUrl: string;
    folder: string;
    tomcatNumber: number;
    buildParams: string | undefined;
    parentRepo: string;
    tokenName: string;
    webPath: string;
    warPath: string;
    javaVersion: 7 | 8 | 17;
    parentFolder: string;
    subRepo: boolean;
  }> = {}
): Service => ({
  branch: "local",
  enabled: false,
  favorite: false,
  description:
    "An AI powered developer platform that allows developer to create, store and manage.",
  gitUrl: config.gitUrl || "",
  folder: config.folder || "",
  tomcatNumber: config.tomcatNumber || 0,
  buildParams: config.buildParams || "",
  parentRepo: config.parentRepo || "",
  tokenName: config.tokenName || "",
  webPath: config.webPath || "",
  warPath: config.warPath || "",
  id: config.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "",
  name: config.name || "",
  path: "",
  port: 0,
  javaVersion: config.javaVersion || 8,
  parentFolder: config.parentFolder || "",
  subRepo: config.subRepo || false,
});

export const initialServices: Service[] = [
  createService({
    name: "DS 3.0",
    parentFolder: "core-services",
    folder: "projects/services/src-services/data-services",
    tokenName: "DataService30",
    webPath: "data-services-3.0",
    warPath:
      "core-services/projects/services/target/bullhorn-data-services-3.0",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/core-services.git",
    parentRepo: "Core Services",
    tomcatNumber: 2,
    buildParams: " -t ./toolchains.xml ",
    subRepo: true,
  }),
  createService({
    name: "DS 4.0",
    parentFolder: "core-services",
    folder: "projects-jdk17/data-services",
    tokenName: "DataService40",
    webPath: "data-services-4.0",
    warPath:
      "core-services/projects-jdk17/data-services/target/data-services-4.0",
    javaVersion: 17,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/core-services.git",
    parentRepo: "Core Services",
    tomcatNumber: 4,
    buildParams: " -t ./toolchains.xml ",
    subRepo: true,
  }),
  createService({
    name: "Data Event Services",
    parentFolder: "core-services",
    folder: "projects/services/src-services/data-event-services",
    tokenName: "DataEventService",
    webPath: "data-event-services",
    warPath:
      "core-services/projects/services/target/bullhorn-data-event-services-0.1",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/core-services.git",
    parentRepo: "Core Services",
    tomcatNumber: 2,
    buildParams: " -t ./toolchains.xml ",
    subRepo: true,
  }),
  createService({
    name: "Daytona Consumer v2",
    parentFolder: "core-services",
    folder: "projects/services/src-services/daytona-consumer",
    tokenName: "daytonaConsumerV2",
    webPath: "daytona-consumer",
    warPath:
      "core-services/projects/services/target/bullhorn-daytona-consumer-2.0",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/core-services.git",
    parentRepo: "Core Services",
    tomcatNumber: 2,
    buildParams: " -t ./toolchains.xml ",
    subRepo: true,
  }),
  createService({
    name: "Daytona Indexer v2",
    parentFolder: "core-services",
    folder: "projects/services/src-services/daytona-producer",
    tokenName: "daytonaIndexV2",
    webPath: "indexing",
    warPath:
      "core-services/projects/services/target/bullhorn-daytona-producer-0.1",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/core-services.git",
    parentRepo: "Core Services",
    tomcatNumber: 2,
    buildParams: " -t ./toolchains.xml ",
    subRepo: true,
  }),
  createService({
    name: "Daytona Search v2",
    parentFolder: "core-services",
    folder: "projects/services/src-services/daytona-search",
    tokenName: "daytonaSearchV2",
    webPath: "search",
    warPath:
      "core-services/projects/services/target/bullhorn-daytona-search-2.0",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/core-services.git",
    parentRepo: "Core Services",
    tomcatNumber: 2,
    buildParams: " -t ./toolchains.xml ",
    subRepo: true,
  }),
  createService({
    name: "Email Services",
    parentFolder: "core-services",
    folder: "projects/services/src-services/email-services",
    tokenName: "EmailService",
    webPath: "email-services",
    warPath:
      "core-services/projects/services/target/bullhorn-email-services-0.1",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/core-services.git",
    parentRepo: "Core Services",
    tomcatNumber: 2,
    buildParams: " -t ./toolchains.xml ",
    subRepo: true,
  }),
  createService({
    name: "Franklin (Appointment-Services)",
    parentFolder: "core-services",
    folder: "projects/services/src-services/franklin-services",
    tokenName: "FranklinService",
    webPath: "appointment-services",
    warPath:
      "core-services/projects/services/target/bullhorn-franklin-services-0.1",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/core-services.git",
    parentRepo: "Core Services",
    tomcatNumber: 2,
    buildParams: " -t ./toolchains.xml ",
    subRepo: true,
  }),
  createService({
    name: "OAuth Services",
    parentFolder: "core-services",
    folder: "projects/services/src-services/oauth-services",
    tokenName: "OAuthService",
    webPath: "oauth",
    warPath:
      "core-services/projects/services/target/bullhorn-oauth-services-2.0",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/core-services.git",
    parentRepo: "Core Services",
    tomcatNumber: 2,
    buildParams: " -t ./toolchains.xml ",
    subRepo: true,
  }),
  createService({
    name: "Rest Services",
    parentFolder: "core-services",
    folder: "projects-jdk17/rest-services",
    tokenName: "RestService",
    webPath: "rest-services",
    warPath:
      "core-services/projects-jdk17/rest-services/target/rest-services-4.0",
    javaVersion: 17,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/core-services.git",
    parentRepo: "Core Services",
    tomcatNumber: 4,
    buildParams: " -t ./toolchains.xml ",
    subRepo: true,
  }),
  createService({
    name: "Admin API",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/admin-api-services.git",
    folder: "admin-api-services",
    tomcatNumber: 3,
    tokenName: "AdminApi",
    webPath: "admin-api-services",
    warPath: "admin-api-services/admin-api-services/target/admin-api-services",
    javaVersion: 8,
  }),
  createService({
    name: "Bifrost: bullhorn-to-linkedin-bootstrap",
    parentFolder: "bifrost",
    folder: "",
    tokenName: "Bifrost_bullhorn-to-linkedin-bootstrap",
    webPath: "bullhorn-to-linkedin-bootstrap",
    warPath:
      "bifrost/bullhorn-to-linkedin-bootstrap/target/bullhorn-to-linkedin-bootstrap",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/bifrost.git",
    parentRepo: "Bifrost",
    tomcatNumber: 3,
    buildParams: "",
    subRepo: true,
  }),
  createService({
    name: "Bifrost: bullhorn-to-linkedin-decommission",
    parentFolder: "bifrost",
    folder: "",
    tokenName: "Bifrost_bullhorn-to-linkedin-decommission",
    webPath: "bullhorn-to-linkedin-decommission",
    warPath:
      "bifrost/bullhorn-to-linkedin-decommission/target/bullhorn-to-linkedin-decommission",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/bifrost.git",
    parentRepo: "Bifrost",
    tomcatNumber: 3,
    buildParams: "",
    subRepo: true,
  }),
  createService({
    name: "Bifrost: bullhorn-to-linkedin-live-sync",
    parentFolder: "bifrost",
    folder: "",
    tokenName: "Bifrost_bullhorn-to-linkedin-live-sync",
    webPath: "bullhorn-to-linkedin-live-sync",
    warPath:
      "bifrost/bullhorn-to-linkedin-live-sync/target/bullhorn-to-linkedin-live-sync",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/bifrost.git",
    parentRepo: "Bifrost",
    tomcatNumber: 3,
    buildParams: "",
    subRepo: true,
  }),
  createService({
    name: "Bifrost: kafka-integration-test-consumer",
    parentFolder: "bifrost",
    folder: "",
    tokenName: "Bifrost_kafka-integration-test-consumer",
    webPath: "kafka-integration-test-consumer",
    warPath:
      "bifrost/kafka-integration-test-consumer/target/kafka-integration-test-consumer",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/bifrost.git",
    parentRepo: "Bifrost",
    tomcatNumber: 3,
    buildParams: "",
    subRepo: true,
  }),
  createService({
    name: "Bifrost: linkedin-callback-controller",
    parentFolder: "bifrost",
    folder: "",
    tokenName: "Bifrost_linkedin-callback-controller",
    webPath: "linkedin-callback-controller",
    warPath:
      "bifrost/linkedin-callback-controller/target/linkedin-callback-controller",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/bifrost.git",
    parentRepo: "Bifrost",
    tomcatNumber: 3,
    buildParams: "",
    subRepo: true,
  }),
  createService({
    name: "Bifrost: linkedin-inmail-and-note-consumer",
    parentFolder: "bifrost",
    folder: "",
    tokenName: "Bifrost_linkedin-inmail-and-note-consumer",
    webPath: "linkedin-inmail-and-note-consumer",
    warPath:
      "bifrost/linkedin-inmail-and-note-consumer/target/linkedin-inmail-and-note-consumer",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/bifrost.git",
    parentRepo: "Bifrost",
    tomcatNumber: 3,
    buildParams: "",
    subRepo: true,
  }),
  createService({
    name: "Bifrost: linkedin-one-click-export",
    parentFolder: "bifrost",
    folder: "",
    tokenName: "Bifrost_linkedin-one-click-export",
    webPath: "linkedin-one-click-export",
    warPath:
      "bifrost/linkedin-one-click-export/target/linkedin-one-click-export",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/bifrost.git",
    parentRepo: "Bifrost",
    tomcatNumber: 3,
    buildParams: "",
    subRepo: true,
  }),
  createService({
    name: "Bifrost: linkedin-poll-request-forwarder",
    parentFolder: "bifrost",
    folder: "",
    tokenName: "Bifrost_linkedin-poll-request-forwarder",
    webPath: "linkedin-poll-request-forwarder",
    warPath:
      "bifrost/linkedin-poll-request-forwarder/target/linkedin-poll-request-forwarder",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/bifrost.git",
    parentRepo: "Bifrost",
    tomcatNumber: 3,
    buildParams: "",
    subRepo: true,
  }),
  createService({
    name: "Billing Sync Services",
    parentFolder: "billing-sync",
    folder: "",
    tokenName: "BillingSyncService",
    webPath: "billing-sync-services",
    warPath: "billing-sync/billing-sync-services/target/billing-sync-services",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:MIDDLE_OFFICE/billing-sync.git",
    parentRepo: "Billing Sync",
    tomcatNumber: 3,
    buildParams: "",
    subRepo: true,
  }),
  createService({
    name: "Billing Sync Consumer Services",
    parentFolder: "billing-sync",
    folder: "",
    tokenName: "BillingSyncConsumerService",
    webPath: "billing-sync-consumer-services",
    warPath:
      "billing-sync/billing-sync-consumer-services/target/billing-sync-consumer-services",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:MIDDLE_OFFICE/billing-sync.git",
    parentRepo: "Billing Sync",
    tomcatNumber: 3,
    buildParams: "",
    subRepo: true,
  }),
  createService({
    name: "Billing Sync Monitor",
    gitUrl: "git@bhsource.bullhorn.com:MIDDLE_OFFICE/billing-sync-monitor.git",
    folder: "billing-sync-monitor",
    tomcatNumber: 3,
    tokenName: "BillingSyncMonitor",
    webPath: "billing-sync-monitor",
    warPath: "billing-sync-monitor/target/billing-sync-monitor",
    javaVersion: 8,
  }),
  createService({
    name: "Caldera",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/caldera.git",
    folder: "caldera",
    tomcatNumber: 1,
    tokenName: "Caldera",
    webPath: "core",
    warPath: "caldera/target/caldera-0.1",
    javaVersion: 8,
  }),
  createService({
    name: "Canvas Services",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/canvas-services.git",
    folder: "canvas-services",
    tomcatNumber: 5,
    tokenName: "CanvasServices",
    webPath: "canvas-services",
    warPath: "canvas-services/target/canvas-services",
    javaVersion: 17,
  }),
  createService({
    name: "CDC",
    gitUrl:
      "git@bhsource.bullhorn.com:ATS_CRM/change-data-capture-services.git",
    folder: "change-data-capture-services",
    tomcatNumber: 3,
    tokenName: "CDC",
    webPath: "change-data-capture-services",
    warPath:
      "change-data-capture-services/change-data-capture-services/target/change-data-capture-services",
    javaVersion: 8,
  }),
  createService({
    name: "Daytona Consumer V1",
    parentFolder: "classic_ats",
    folder: "",
    tokenName: "daytonaConsumerV1",
    webPath: "daytona-consumer",
    warPath:
      "classic_ats/java/projects/services/src-services/daytona-consumer/target/bullhorn-daytona-consumer-0.1",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:LEGACY_ATS/classic_ats.git",
    parentRepo: "Classic ATS",
    tomcatNumber: 1,
    buildParams: "",
    subRepo: true,
  }),
  createService({
    name: "Daytona Search V1",
    parentFolder: "classic_ats",
    folder: "",
    tokenName: "daytonaSearchV1",
    webPath: "search",
    warPath:
      "classic_ats/java/projects/services/src-services/daytona-search/target/bullhorn-daytona-search-0.1",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:LEGACY_ATS/classic_ats.git",
    parentRepo: "Classic ATS",
    tomcatNumber: 1,
    buildParams: "",
    subRepo: true,
  }),
  createService({
    name: "Daytona Cron V1",
    parentFolder: "classic_ats",
    folder: "",
    tokenName: "cron",
    webPath: "cron",
    warPath: "classic_ats/java/projects/cron/target/bullhorn-cron-0.1",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:LEGACY_ATS/classic_ats.git",
    parentRepo: "Classic ATS",
    tomcatNumber: 1,
    buildParams: "",
    subRepo: true,
  }),
  createService({
    name: "ColdFusion",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/coldfusion.git",
    folder: "CFusionMX7",
    tokenName: "",
    webPath: "",
    warPath: "",
    javaVersion: 8,
  }),
  createService({
    name: "Data Event Outbox Cleanup",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/dataeventoutboxcleanup.git",
    folder: "dataeventoutboxcleanup",
    tomcatNumber: 5,
    tokenName: "dataeventoutboxcleanup",
    webPath: "dataeventoutboxcleanup",
    warPath: "dataeventoutboxcleanup/target/dataeventoutboxcleanup",
    javaVersion: 17,
  }),
  createService({
    name: "Data Event Outbox Reader",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/dataeventoutboxreader.git",
    folder: "dataeventoutboxreader",
    tomcatNumber: 5,
    tokenName: "dataeventoutboxreader",
    webPath: "dataeventoutboxreader",
    warPath: "dataeventoutboxreader/target/dataeventoutboxreader",
    javaVersion: 17,
  }),
  createService({
    name: "Data Hub",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/data-hub.git",
    folder: "data-hub",
    tokenName: "",
    webPath: "",
    warPath: "",
    javaVersion: 8,
  }),
  createService({
    name: "Data Mirror Client",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/data-mirror-client-ems.git",
    folder: "data-mirror-client-ems",
    tokenName: "",
    webPath: "",
    warPath: "",
    javaVersion: 8,
  }),
  createService({
    name: "Data Mirror SQL",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/data-mirror-sql.git",
    folder: "data-mirror-sql",
    tokenName: "",
    webPath: "",
    warPath: "",
    javaVersion: 8,
  }),
  createService({
    name: "Data Sync",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/data-sync-services.git",
    folder: "data-sync-services",
    tomcatNumber: 3,
    tokenName: "DataSyncService",
    webPath: "data-sync-services",
    warPath: "data-sync-services/data-sync-services/target/data-sync-services",
    javaVersion: 8,
  }),
  createService({
    name: "Devmachine",
    gitUrl: "git@bhsource.bullhorn.com:DEV_WORKSPACE/devmachine.git",
    folder: "",
    tokenName: "",
    webPath: "",
    warPath: "",
    javaVersion: 8,
  }),
  createService({
    name: "DM Automation",
    gitUrl: "git@bhsource.bullhorn.com:AUTOMATION/data-mirror-automation.git",
    folder: "data-mirror-automation",
    tokenName: "",
    webPath: "",
    warPath: "",
    javaVersion: 8,
  }),
  createService({
    name: "DS 1.0",
    gitUrl: "git@bhsource.bullhorn.com:LEGACY_ATS/dataservices-0_1.git",
    folder: "dataservices-0_1",
    tomcatNumber: 1,
    tokenName: "DataService10",
    webPath: "data-services",
    warPath:
      "dataservices-0_1/java/projects/services/src-services/data-services/target/bullhorn-data-services-0.1",
    javaVersion: 7,
  }),
  createService({
    name: "DS 2.0",
    gitUrl: "git@bhsource.bullhorn.com:LEGACY_ATS/dataservices-2_0.git",
    folder: "dataservices-2_0",
    tomcatNumber: 1,
    tokenName: "DataService20",
    webPath: "data-services-2.0",
    warPath:
      "dataservices-2_0/java/projects/services/src-services/data-services/target/bullhorn-data-services-2.0",
    javaVersion: 7,
  }),
  createService({
    name: "DS 2.5",
    gitUrl: "git@bhsource.bullhorn.com:LEGACY_ATS/dataservices-2-5.git",
    folder: "dataservices-2-5",
    tomcatNumber: 1,
    tokenName: "DataService25",
    webPath: "data-services-2.5",
    warPath:
      "dataservices-2-5/java/projects/services/src-services/data-services/target/bullhorn-data-services-2.5",
    javaVersion: 7,
  }),
  createService({
    name: "EMS",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/entity-model-streamer.git",
    folder: "entity-model-streamer",
    tomcatNumber: 5,
    tokenName: "EMS",
    webPath: "entity-model-streamer",
    warPath:
      "entity-model-streamer/entity-model-streamer-services/target/entity-model-streamer",
    javaVersion: 17,
  }),
  createService({
    name: "Estaff Integrations",
    gitUrl: " git@bhsource.bullhorn.com:ATS_CRM/estaff-integrations.git",
    folder: "estaff-integrations",
    tomcatNumber: 2,
    tokenName: "EstaffIntegrations",
    webPath: "estaff-integrations-services",
    warPath:
      "estaff-integrations/estaff-integrations-services/target/estaff-integrations-services",
    javaVersion: 8,
  }),
  createService({
    name: "ETL Services",
    gitUrl: "git@bhsource.bullhorn.com:MIDDLE_OFFICE/etl-services.git",
    folder: "etl-services",
    tokenName: "",
    webPath: "",
    warPath: "",
    javaVersion: 8,
  }),
  createService({
    name: "Event Comparator",
    gitUrl: "git@bhsource.bullhorn.com:DEV_WORKSPACE/event-comparator.git",
    folder: "event-comparator",
    tomcatNumber: 5,
    tokenName: "event-comparator",
    webPath: "event-comparator",
    warPath: "event-comparator/target/event-comparator",
    javaVersion: 17,
  }),
  createService({
    name: "Event Processor",
    gitUrl: "git@bhsource.bullhorn.com:search_ai/event-processor.git",
    folder: "event-processor",
    tomcatNumber: 5,
    tokenName: "event-processor",
    webPath: "event-processor",
    warPath: "event-processor/target/event-processor",
    javaVersion: 17,
  }),
  createService({
    name: "Event Worker",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/event-worker-services.git",
    folder: "event-worker-services",
    tomcatNumber: 5,
    tokenName: "EventWorker",
    webPath: "event-worker-services",
    warPath: "event-worker-services/target/event-worker-services",
    javaVersion: 17,
  }),
  createService({
    name: "Gateway Proxy",
    gitUrl:
      "git@bhsource.bullhorn.com:platform/java/services/gateway-proxy.git",
    folder: "gateway-proxy",
    tomcatNumber: 5,
    tokenName: "gateway-proxy",
    webPath: "gateway-proxy-services",
    warPath: "gateway-proxy/target/gateway-proxy-services",
    javaVersion: 17,
  }),
  createService({
    name: "Geyser",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/geyser.git",
    folder: "geyser",
    tomcatNumber: 2,
    tokenName: "geyser",
    webPath: "geyser",
    warPath: "geyser/target/geyser-0.1",
    javaVersion: 8,
  }),
  createService({
    name: "Index Event Distributor",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/index-event-distributor.git",
    folder: "index-event-distributor",
    tomcatNumber: 5,
    tokenName: "index-event-distributor",
    webPath: "index-event-distributor",
    warPath: "index-event-distributor/target/index-event-distributor",
    javaVersion: 17,
  }),
  createService({
    name: "Invoice Services",
    gitUrl: "git@bhsource.bullhorn.com:MIDDLE_OFFICE/invoice-services.git",
    folder: "invoice-services",
    tomcatNumber: 3,
    tokenName: "InvoiceService",
    webPath: "invoice-services",
    warPath: "invoice-services/invoice-services/target/invoice-services",
    javaVersion: 8,
  }),
  createService({
    name: "Jira GitLab Integrator",
    gitUrl:
      "git@bhsource.bullhorn.com:internal_tooling/jira-gitlab-integrator.git",
    folder: "jira-gitlab-integrator",
    tokenName: "",
    webPath: "",
    warPath: "",
    javaVersion: 8,
  }),
  createService({
    name: "SOAP 2.6",
    parentFolder: "legacy-core-services",
    folder: "",
    tokenName: "SoapService26",
    webPath: "webservices-2.6",
    warPath:
      "legacy-core-services/projects/services/target/bullhorn-api-services-2.6",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:LEGACY_ATS/legacy-core-services.git",
    parentRepo: "Legacy CS",
    tomcatNumber: 1,
    buildParams: " -f projects/pom.xml ",
    subRepo: true,
  }),
  createService({
    name: "DS 2.6",
    parentFolder: "legacy-core-services",
    folder: "",
    tokenName: "DataService26",
    webPath: "data-services-2.6",
    warPath:
      "legacy-core-services/projects/services/target/bullhorn-data-services-2.6",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:LEGACY_ATS/legacy-core-services.git",
    parentRepo: "Legacy CS",
    tomcatNumber: 1,
    buildParams: " -f projects/pom.xml ",
    subRepo: true,
  }),
  createService({
    name: "Scheduler",
    parentFolder: "legacy-core-services",
    folder: "",
    tokenName: "Scheduler",
    webPath: "scheduler-services",
    warPath:
      "legacy-core-services/projects/services/target/bullhorn-scheduler-services-0.1",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:LEGACY_ATS/legacy-core-services.git",
    parentRepo: "Legacy CS",
    tomcatNumber: 1,
    buildParams: " -f projects/pom.xml ",
    subRepo: true,
  }),
  createService({
    name: "Helsinki (isync)",
    parentFolder: "legacy-core-services",
    folder: "",
    tokenName: "helsinki",
    webPath: "isync",
    warPath:
      "legacy-core-services/projects/services/target/bullhorn-helsinki-services-0.1",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:LEGACY_ATS/legacy-core-services.git",
    parentRepo: "Legacy CS",
    tomcatNumber: 1,
    buildParams: " -f projects/pom.xml ",
    subRepo: true,
  }),
  createService({
    name: "Pulse",
    parentFolder: "legacy-core-services",
    folder: "",
    tokenName: "pulse",
    webPath: "pulse-services",
    warPath:
      "legacy-core-services/projects/services/target/bullhorn-pulse-services-0.1",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:LEGACY_ATS/legacy-core-services.git",
    parentRepo: "Legacy CS",
    tomcatNumber: 1,
    buildParams: " -f projects/pom.xml ",
    subRepo: true,
  }),
  createService({
    name: "Magma",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/magma.git",
    folder: "magma",
    tomcatNumber: 3,
    tokenName: "magma",
    webPath: "magma",
    warPath: "magma/target/magma",
    javaVersion: 8,
  }),
  createService({
    name: "mail-list-service",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/mail-list-service.git",
    folder: "mail-list-service",
    tomcatNumber: 5,
    tokenName: "mail-list-service",
    webPath: "bullhorn-mail-list-services-0.1",
    warPath: "mail-list-service/target/bullhorn-mail-list-services-0.1",
    javaVersion: 17,
  }),
  createService({
    name: "Mass Action Consumer",
    parentFolder: "mass-action-services",
    folder: "",
    tokenName: "MassActionConsumer",
    webPath: "mass-action-consumer",
    warPath:
      "mass-action-services/mass-action-consumer/target/mass-action-consumer",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/mass-action-services.git",
    parentRepo: "Mass Action Services",
    tomcatNumber: 3,
    buildParams: "",
    subRepo: true,
  }),
  createService({
    name: "Mass Action Producer",
    parentFolder: "mass-action-services",
    folder: "",
    tokenName: "MassActionProducer",
    webPath: "mass-action-producer",
    warPath:
      "mass-action-services/mass-action-producer/target/mass-action-producer",
    javaVersion: 8,
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/mass-action-services.git",
    parentRepo: "Mass Action Services",
    tomcatNumber: 3,
    buildParams: "",
    subRepo: true,
  }),
  createService({
    name: "Montage",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/montage.git",
    folder: "montage",
    tokenName: "",
    webPath: "",
    warPath: "",
    javaVersion: 8,
  }),
  createService({
    name: "Mosaic",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/mosaic.git",
    folder: "mosaic",
    tokenName: "",
    webPath: "",
    warPath: "",
    javaVersion: 8,
  }),
  createService({
    name: "Novo",
    gitUrl: "git@bhsource.bullhorn.com:NOVO/novo.git",
    folder: "novo",
    tokenName: "",
    webPath: "",
    warPath: "",
    javaVersion: 8,
  }),
  createService({
    name: "Novo Automation",
    gitUrl: "git@bhsource.bullhorn.com:NOVO/novo-automation.git",
    folder: "novo-automation",
    tokenName: "",
    webPath: "",
    warPath: "",
    javaVersion: 8,
  }),
  createService({
    name: "Payable Export",
    gitUrl:
      "git@bhsource.bullhorn.com:MIDDLE_OFFICE/payable-export-services.git",
    folder: "payable-export-services",
    tomcatNumber: 3,
    tokenName: "PayableExportService",
    webPath: "payable-export-services",
    warPath:
      "payable-export-services/payable-export-services/target/payable-export-services",
    javaVersion: 8,
  }),
  createService({
    name: "Rest API Tests",
    gitUrl: "git@bhsource.bullhorn.com:AUTOMATION/rest-api-tests.git",
    folder: "rest-api-tests",
    tokenName: "",
    webPath: "",
    warPath: "",
    javaVersion: 8,
  }),
  createService({
    name: "Resume Parse Services",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/resume-parse-services.git",
    folder: "resume-parse-services",
    tomcatNumber: 5,
    tokenName: "ResumeParseServices",
    webPath: "resume-parse-services",
    warPath: "resume-parse-services/target/resume-parse-services",
    javaVersion: 17,
  }),
  createService({
    name: "Sample OAuth",
    gitUrl: "git@bhsource.bullhorn.com:DEV_WORKSPACE/sample-oauth.git",
    folder: "sample-oauth",
    tomcatNumber: 5,
    tokenName: "SampleOAuth",
    webPath: "sample-oauth",
    warPath: "sample-oauth/target/sample-oauth",
    javaVersion: 17,
  }),
  createService({
    name: "Seek Webhook",
    gitUrl: " git@bhsource.bullhorn.com:ATS_CRM/seek-integration-services.git",
    folder: "seek-integration-services",
    tomcatNumber: 3,
    tokenName: "SeekWebhook",
    webPath: "seek-webhook-service",
    warPath:
      "seek-integration-services/seek-webhook-service/target/seek-webhook-service",
    javaVersion: 8,
  }),
  createService({
    name: "SMS Service",
    gitUrl: "git@bhsource.bullhorn.com:SHARED/SMSService.git",
    folder: "SMSService",
    tomcatNumber: 2,
    tokenName: "SMSService",
    webPath: "smsservice",
    warPath: "SMSService/target/bullhorn-smsservice-0.1",
    javaVersion: 8,
  }),
  createService({
    name: "SOAP 1.0",
    gitUrl: "git@bhsource.bullhorn.com:LEGACY_ATS/apiservices-0_1.git",
    folder: "apiservices-0_1",
    tomcatNumber: 1,
    tokenName: "SOAP10",
    webPath: "webservices-1.0",
    warPath:
      "apiservices-0_1/java/projects/services/src-services/api-services/target/bullhorn-api-services-0.1",
    javaVersion: 7,
  }),
  createService({
    name: "SOAP 1.1",
    gitUrl: "git@bhsource.bullhorn.com:LEGACY_ATS/apiservices-1_1.git",
    folder: "apiservices-1_1",
    tomcatNumber: 1,
    tokenName: "SOAP11",
    webPath: "webservices-1.1",
    warPath:
      "apiservices-0_1/java/projects/services/src-services/api-services/target/bullhorn-api-services-0.1",
    javaVersion: 7,
  }),
  createService({
    name: "SOAP 2.0",
    gitUrl: "git@bhsource.bullhorn.com:LEGACY_ATS/apiservices-2_0.git",
    folder: "apiservices-2_0",
    tomcatNumber: 1,
    tokenName: "SOAP20",
    webPath: "webservices-2.0",
    warPath:
      "apiservices-2_0/java/projects/services/src-services/api-services/target/bullhorn-api-services-2.0",
    javaVersion: 7,
  }),
  createService({
    name: "SOAP 2.5",
    gitUrl: "git@bhsource.bullhorn.com:LEGACY_ATS/apiservices-2_5.git",
    folder: "apiservices-2_5",
    tomcatNumber: 1,
    tokenName: "SOAP25",
    webPath: "webservices-2.5",
    warPath:
      "apiservices-2_5/java/projects/services/src-services/api-services/target/bullhorn-api-services-2.5",
    javaVersion: 7,
  }),
  createService({
    name: "SQL",
    gitUrl: "git@bhsource.bullhorn.com:ATS_CRM/sql.git",
    folder: "sql",
    tokenName: "",
    webPath: "",
    warPath: "",
    javaVersion: 8,
  }),
  createService({
    name: "Status Processor",
    gitUrl: "git@bhsource.bullhorn.com:search_ai/status-processor.git",
    folder: "status-processor",
    tomcatNumber: 5,
    tokenName: "status-processor",
    webPath: "status-processor-services",
    warPath:
      "status-processor/status-processor-services/target/status-processor-services",
    javaVersion: 17,
  }),
  createService({
    name: "Time and Labor API",
    gitUrl: "git@bhsource.bullhorn.com:BTE_ONE/time-and-labor-api.git",
    folder: "time-and-labor-api",
    tomcatNumber: 5,
    tokenName: "TimeAndLaborAPI",
    webPath: "time-and-labor-api",
    warPath: "time-and-labor-api/target/time-and-labor-api",
    javaVersion: 8,
  }),
  createService({
    name: "Tomcat",
    gitUrl: "git@bhsource.bullhorn.com:QA_ENVIRONMENTS/bh-tomcat.git",
    folder: "tomcat",
    tokenName: "",
    webPath: "",
    warPath: "",
    javaVersion: 8,
  }),
  createService({
    name: "Tomcat 10",
    gitUrl: "git@bhsource.bullhorn.com:QA_ENVIRONMENTS/bh-tomcat10.git",
    folder: "tomcat10",
    tokenName: "",
    webPath: "",
    warPath: "",
    javaVersion: 8,
  }),
  createService({
    name: "Translation Automation Bundler",
    gitUrl:
      "git@bhsource.bullhorn.com:internal_tooling/translation-automation.git",
    folder: "translation-automation",
    tokenName: "",
    webPath: "",
    warPath: "",
    javaVersion: 8,
  }),
  createService({
    name: "Translation Automation Merger",
    gitUrl:
      "git@bhsource.bullhorn.com:DEV_WORKSPACE/translation-automation-mr.git",
    folder: "translation-automation-mr",
    tokenName: "",
    webPath: "",
    warPath: "",
    javaVersion: 8,
  }),
  createService({
    name: "Universal Login",
    gitUrl: "git@bhsource.bullhorn.com:NOVO/universal-login.git",
    folder: "universal-login",
    tomcatNumber: 5,
    tokenName: "UniversalLogin",
    webPath: "universal-login",
    warPath: "universal-login/target/universal-login",
    javaVersion: 17,
  }),
  createService({
    name: "Vector Embeddings",
    gitUrl: "git@bhsource.bullhorn.com:search_ai/vector-embeddings-service.git",
    folder: "vector-embeddings-service",
    tomcatNumber: 5,
    tokenName: "vector-embeddings-service",
    webPath: "vector-embeddings-service",
    warPath: "vector-embeddings-service/target/vector-embeddings-service",
    javaVersion: 17,
  }),
];
