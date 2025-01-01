import { useState, useCallback } from "react";
import { Service } from "@/types/service";

export function useServices(initialServices: Service[]) {
  const [showFavorites, setShowFavorites] = useState(false);
  const [sections, setSections] = useState({
    allServices: initialServices,
    favorites: [] as Service[],
    enabled: [] as Service[]
  });

  const initializeServices = useCallback((
    allServices: Service[],
    favorites: string[],
    enabled: string[]
  ) => {
    setSections(prev => ({
      allServices: allServices.map(service => ({
        ...service,
        favorite: favorites.includes(service.title),
        enabled: enabled.includes(service.title)
      })),
      favorites: allServices.filter(service => favorites.includes(service.title)),
      enabled: allServices.filter(service => enabled.includes(service.title))
    }));
  }, []);

  const toggleFavorite = useCallback((title: string) => {
    setSections(prev => {
      // Find the service in allServices
      const service = prev.allServices.find(s => s.title === title);
      if (!service) return prev;

      // Create updated service with toggled favorite status
      const updatedService = { ...service, favorite: !service.favorite };

      // Update allServices
      const updatedAllServices = prev.allServices.map(s => 
        s.title === title ? updatedService : s
      );

      // Update favorites list
      const updatedFavorites = updatedService.favorite
        ? [...prev.favorites, updatedService]
        : prev.favorites.filter(s => s.title !== title);

      return {
        allServices: updatedAllServices,
        favorites: updatedFavorites,
        enabled: prev.enabled
      };
    });
  }, []);

  const toggleEnabled = useCallback((title: string) => {
    setSections(prev => {
      // Find the service in allServices
      const service = prev.allServices.find(s => s.title === title);
      if (!service) return prev;

      // Create updated service with toggled enabled status
      const updatedService = { ...service, enabled: !service.enabled };

      // Update allServices
      const updatedAllServices = prev.allServices.map(s => 
        s.title === title ? updatedService : s
      );

      // Update enabled list
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
  }, []);

  return {
    showFavorites,
    setShowFavorites,
    sections,
    toggleFavorite,
    toggleEnabled,
    initializeServices
  };
} 