import { useState, useMemo, useCallback } from 'react'
import { Service, ServiceSection } from '@/types/service'

interface UseServicesReturn {
  showFavorites: boolean
  searchQuery: string
  setShowFavorites: (show: boolean) => void
  setSearchQuery: (query: string) => void
  sections: ServiceSection
  toggleFavorite: (serviceId: string) => void
  toggleEnabled: (serviceId: string) => void
}

export const useServices = (initialServices: Service[]): UseServicesReturn => {
  const [showFavorites, setShowFavorites] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [services, setServices] = useState(initialServices)

  const toggleFavorite = useCallback((serviceId: string) => {
    setServices(prev =>
      prev.map(service =>
        service.serviceId === serviceId
          ? { ...service, favorite: !service.favorite }
          : service
      )
    )
  }, [])

  const toggleEnabled = useCallback((serviceId: string) => {
    setServices(prev =>
      prev.map(service =>
        service.serviceId === serviceId
          ? { ...service, enabled: !service.enabled }
          : service
      )
    )
  }, [])

  const filteredServices = useMemo(() => {
    if (!searchQuery) return services

    const query = searchQuery.toLowerCase()
    return services.filter(
      service =>
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.serviceId.toLowerCase().includes(query)
    )
  }, [services, searchQuery])

  const sections = useMemo(() => {
    if (!showFavorites) {
      return {
        allServices: filteredServices.sort((a, b) => {
          if (a.favorite && !b.favorite) return -1
          if (!a.favorite && b.favorite) return 1
          if (a.enabled && !b.enabled) return -1
          if (!a.enabled && b.enabled) return 1
          return 0
        }),
        favorites: [],
        enabled: []
      }
    }

    const favorites = filteredServices.filter(service => service.favorite)
    const enabled = filteredServices.filter(service => service.enabled && !service.favorite)

    return {
      allServices: [],
      favorites,
      enabled
    }
  }, [filteredServices, showFavorites])

  return {
    showFavorites,
    searchQuery,
    setShowFavorites,
    setSearchQuery,
    sections,
    toggleFavorite,
    toggleEnabled
  }
} 