import type { Service, ServiceCategory } from '@/types/service'

const createService = (
  title: string,
  category: ServiceCategory,
  serviceId: string,
  enabled = false,
  favorite = false
): Service => ({
  title,
  category,
  serviceId,
  enabled,
  favorite,
  description: "An AI powered developer platform that allows developer to create, store and manage.",
  lastUpdated: new Date(),
  tags: [category]
})

export const initialServices: Service[] = [
  createService("Core Services", "core", "f/BH-10125-auth-fix", true, true),
  createService("Novo Integration", "integration", "f/BH-85475-candida", true),
  createService("Event Worker", "worker", "f/BH-67890-event-worker", false, true),
  createService("Data Sync", "data", "f/BH-54321-data-sync"),
  createService("Canvas Services", "core", "f/BH-12345-test"),
  createService("DataHub", "data", "f/BH-95856-dashboa", false, true),
]