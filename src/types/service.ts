export type ServiceCategory = 'core' | 'data' | 'worker' | 'integration'

export interface Service {
  title: string
  description: string
  serviceId: string
  enabled: boolean
  favorite: boolean
  category: ServiceCategory
  tags?: string[]
  lastUpdated?: Date
}

export interface ServiceSection {
  allServices: Service[]
  favorites: Service[]
  enabled: Service[]
} 