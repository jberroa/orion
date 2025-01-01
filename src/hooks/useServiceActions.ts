import { useCallback } from 'react';
import { Service } from '@/types/service';

interface ServiceSections {
  allServices: Service[];
  favorites: Service[];
  enabled: Service[];
}

interface UseServiceActionsProps {
  sections: ServiceSections;
  setSections: (sections: ServiceSections) => void;
}

export function useServiceActions({ sections, setSections }: UseServiceActionsProps) {
  const toggleFavorite = useCallback((title: string) => {
    setSections(prev => {
      const service = prev.allServices.find(s => s.title === title);
      if (!service) return prev;

      const updatedService = { ...service, favorite: !service.favorite };
      const updatedAllServices = prev.allServices.map(s => 
        s.title === title ? updatedService : s
      );

      const updatedFavorites = updatedService.favorite
        ? [...prev.favorites, updatedService]
        : prev.favorites.filter(s => s.title !== title);

      return {
        allServices: updatedAllServices,
        favorites: updatedFavorites,
        enabled: prev.enabled
      };
    });
  }, [setSections]);

  const toggleEnabled = useCallback((title: string) => {
    setSections(prev => {
      const service = prev.allServices.find(s => s.title === title);
      if (!service) return prev;

      const updatedService = { ...service, enabled: !service.enabled };
      const updatedAllServices = prev.allServices.map(s => 
        s.title === title ? updatedService : s
      );

      const updatedEnabled = updatedService.enabled
        ? [...prev.enabled, updatedService]
        : prev.enabled.filter(s => s.title !== title);

      return {
        allServices: updatedAllServices,
        favorites: prev.favorites.map(s => 
          s.title === title ? updatedService : s
        ),
        enabled: updatedEnabled
      };
    });
  }, [setSections]);

  return {
    toggleFavorite,
    toggleEnabled
  };
} 