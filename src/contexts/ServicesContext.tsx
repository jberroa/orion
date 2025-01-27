import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { Service } from '@/types/service';
import { services } from '@/data/services';  // Import directly

interface ServicesContextType {
  showFavorites: boolean;
  setShowFavorites: (show: boolean) => void;
  sections: {
    all: Service[];
    favorites: Service[];
    enabled: Service[];
  };
  toggleFavorite: (id: string) => void;
  toggleEnabled: (id: string) => void;
  skipTests: boolean;
  forceUpdate: boolean;
  setSkipTests: (checked: boolean) => void;
  setForceUpdate: (checked: boolean) => void;
  selectedQABox: string;
  setSelectedQABox: (qa: string) => void;
}

// Export the context
export const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [skipTests, setSkipTests] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [selectedQABox, setSelectedQABox] = useState('');

  // Load initial states from settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await window.electron.invoke('get-settings');
        const enabledServices = settings.enabledServices || [];
        const favoriteServices = settings.favoriteServices || [];
        
        // Load QA box selection
        if (settings.selectedQABox) {
          setSelectedQABox(settings.selectedQABox);
        }
        
        // Initialize services with saved states
        setServicesList(services.map((service) => ({
          ...service,
          id: service.name,
          enabled: enabledServices.includes(service.name),
          favorite: favoriteServices.includes(service.name)
        })));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Save service states whenever they change
  useEffect(() => {
    const saveServicesState = async () => {
      try {
        const currentSettings = await window.electron.invoke('get-settings');
        
        const enabledServices = servicesList
          .filter(service => service.enabled)
          .map(service => service.name);

        const favoriteServices = servicesList
          .filter(service => service.favorite)
          .map(service => service.name);

        await window.electron.invoke('save-settings', {
          ...currentSettings,
          enabledServices,
          favoriteServices
        });
      } catch (error) {
        console.error('Failed to save service states:', error);
      }
    };

    if (servicesList.length > 0) {
      saveServicesState();
    }
  }, [servicesList]);

  // Save QA box selection whenever it changes
  useEffect(() => {
    const saveQABox = async () => {
      try {
        const currentSettings = await window.electron.invoke('get-settings');
        await window.electron.invoke('save-settings', {
          ...currentSettings,
          selectedQABox
        });
      } catch (error) {
        console.error('Failed to save QA box selection:', error);
      }
    };

    if (selectedQABox) {
      saveQABox();
    }
  }, [selectedQABox]);

  // Compute sections based on the current view
  const sections = useMemo(() => ({
    all: servicesList,
    favorites: servicesList.filter(service => service.favorite),
    enabled: servicesList.filter(service => service.enabled)
  }), [servicesList]);

  // Toggle handlers with logging
  const toggleFavorite = (id: string) => {
    console.log('Toggling favorite for:', id);
    setServicesList(prevServices =>
      prevServices.map(service =>
        service.id === id
          ? { ...service, favorite: !service.favorite }
          : service
      )
    );
  };

  const toggleEnabled = (id: string) => {
    console.log('Toggling enabled for:', id);
    setServicesList(prevServices =>
      prevServices.map(service =>
        service.id === id
          ? { ...service, enabled: !service.enabled }
          : service
      )
    );
  };

  const value = {
    showFavorites,
    setShowFavorites,
    sections,
    toggleFavorite,
    toggleEnabled,
    skipTests,
    forceUpdate,
    setSkipTests,
    setForceUpdate,
    selectedQABox,
    setSelectedQABox,
  };

  return (
    <ServicesContext.Provider value={value}>
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