import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Service } from '@/types/service';
import { initialServices } from '@/data/services';

interface ServicesContextType {
  services: Service[];
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
  sections: {
    allServices: Service[];
    favorites: Service[];
    enabled: Service[];
  };
  toggleFavorite: (serviceId: string) => void;
  toggleEnabled: (serviceId: string) => void;
  toggleServiceEnabled: (serviceId: string) => void;
  toggleServiceFavorite: (serviceId: string) => void;
  updateServiceBranch: (serviceId: string, branch: string) => void;
  selectedQABox: string;
  setSelectedQABox: (qa: string) => void;
}

export const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [enabledIds, setEnabledIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedQABox, setSelectedQABox] = useState("");

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await window.electron.invoke('get-settings');
      if (settings.selectedQABox) {
        setSelectedQABox(settings.selectedQABox);
      }
      if (settings.enabledServices) {
        setEnabledIds(settings.enabledServices);
        // Update services enabled state
        setServices(prevServices =>
          prevServices.map(service => ({
            ...service,
            enabled: settings.enabledServices.includes(service.id)
          }))
        );
      }
      if (settings.favoriteServices) {
        setFavoriteIds(settings.favoriteServices);
        // Update services favorite state
        setServices(prevServices =>
          prevServices.map(service => ({
            ...service,
            favorite: settings.favoriteServices.includes(service.id)
          }))
        );
      }
    };
    loadSettings();
  }, []);

  // Save settings when they change
  useEffect(() => {
    const saveSettings = async () => {
      const settings = await window.electron.invoke('get-settings');
      await window.electron.invoke('save-settings', {
        ...settings,
        selectedQABox,
        enabledServices: enabledIds,
        favoriteServices: favoriteIds
      });
    };
    saveSettings();
  }, [enabledIds, favoriteIds, selectedQABox]);

  // Compute sections from IDs
  const sections = {
    allServices: services,
    favorites: services.filter(service => favoriteIds.includes(service.id)),
    enabled: services.filter(service => enabledIds.includes(service.id))
  };

  const toggleEnabled = (serviceId: string) => {
    // Update enabledIds
    setEnabledIds(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
    
    // Update services state
    setServices(prevServices =>
      prevServices.map(service =>
        service.id === serviceId
          ? { ...service, enabled: !service.enabled }
          : service
      )
    );
  };

  const toggleFavorite = (serviceId: string) => {
    // Update favoriteIds
    setFavoriteIds(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
    
    // Update services state
    setServices(prevServices =>
      prevServices.map(service =>
        service.id === serviceId
          ? { ...service, favorite: !service.favorite }
          : service
      )
    );
  };

  const updateServiceBranch = (serviceId: string, branch: string) => {
    setServices(prevServices =>
      prevServices.map(service =>
        service.id === serviceId
          ? { ...service, branch }
          : service
      )
    );
  };

  return (
    <ServicesContext.Provider
      value={{
        services,
        showFavorites,
        setShowFavorites,
        sections,
        toggleFavorite,
        toggleEnabled,
        toggleServiceEnabled: toggleEnabled,
        toggleServiceFavorite: toggleFavorite,
        updateServiceBranch,
        selectedQABox,
        setSelectedQABox,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
} 