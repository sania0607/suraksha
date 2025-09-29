import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import WeatherService, { WeatherData, EmergencyWeatherAlert } from '@/services/weatherService';

interface WeatherContextType {
  weatherData: WeatherData | null;
  weatherAlerts: EmergencyWeatherAlert[];
  isLoading: boolean;
  error: string | null;
  isMonitoring: boolean;
  apiKey: string;
  location: { lat: number; lon: number; name: string } | null;
  
  // Actions
  setApiKey: (key: string) => void;
  setLocation: (lat: number, lon: number, name?: string) => void;
  setLocationByCity: (cityName: string, countryCode?: string) => Promise<boolean>;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  refreshWeatherData: () => Promise<void>;
  clearAlerts: () => void;
  dismissAlert: (alertId: string) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

interface WeatherProviderProps {
  children: ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherAlerts, setWeatherAlerts] = useState<EmergencyWeatherAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [apiKey, setApiKeyState] = useState<string>('');
  const [location, setLocationState] = useState<{ lat: number; lon: number; name: string } | null>(null);
  const [weatherService, setWeatherService] = useState<WeatherService | null>(null);

  // Load saved settings from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openweather_api_key');
    const savedLocation = localStorage.getItem('weather_location');
    
    if (savedApiKey) {
      setApiKeyState(savedApiKey);
    }
    
    if (savedLocation) {
      try {
        const locationData = JSON.parse(savedLocation);
        setLocationState(locationData);
      } catch (error) {
        console.error('Error parsing saved location:', error);
      }
    }
  }, []);

  // Initialize weather service when API key changes
  useEffect(() => {
    if (apiKey) {
      const service = new WeatherService(apiKey);
      setWeatherService(service);
      
      // Set up alert monitoring
      service.onAlertsUpdate((alerts) => {
        setWeatherAlerts(alerts);
        
        // Show browser notification for critical alerts
        alerts.forEach(alert => {
          if (alert.severity === 'critical' && alert.isActive) {
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`🚨 ${alert.title}`, {
                body: alert.message,
                icon: '/favicon.ico'
              });
            }
          }
        });
      });
    }
  }, [apiKey]);

  // Auto-start monitoring when location and service are available
  useEffect(() => {
    if (weatherService && location && apiKey) {
      refreshWeatherData();
    }
  }, [weatherService, location, apiKey]);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('openweather_api_key', key);
    setError(null);
  };

  const setLocation = (lat: number, lon: number, name?: string) => {
    const locationData = { 
      lat, 
      lon, 
      name: name || `${lat.toFixed(2)}, ${lon.toFixed(2)}` 
    };
    setLocationState(locationData);
    localStorage.setItem('weather_location', JSON.stringify(locationData));
    setError(null);
  };

  const setLocationByCity = async (cityName: string, countryCode?: string): Promise<boolean> => {
    if (!weatherService) {
      setError('Weather service not initialized. Please set API key first.');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const coordinates = await weatherService.getCoordinates(cityName, countryCode);
      if (coordinates) {
        setLocation(coordinates.lat, coordinates.lon, cityName);
        return true;
      } else {
        setError(`Location "${cityName}" not found. Please check the spelling.`);
        return false;
      }
    } catch (error) {
      setError(`Error finding location: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWeatherData = async () => {
    if (!weatherService || !location) {
      setError('Weather service or location not configured');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await weatherService.getWeatherData(location.lat, location.lon);
      if (data) {
        setWeatherData(data);
        const alerts = weatherService.convertToEmergencyAlerts(data);
        setWeatherAlerts(alerts);
      } else {
        setError('Failed to fetch weather data. Please check your API key and location.');
      }
    } catch (error) {
      setError(`Weather data error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startMonitoring = () => {
    if (!weatherService || !location) {
      setError('Cannot start monitoring: Weather service or location not configured');
      return;
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    weatherService.startAlertMonitoring(location.lat, location.lon, 15); // Check every 15 minutes
    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    if (weatherService) {
      weatherService.stopAlertMonitoring();
    }
    setIsMonitoring(false);
  };

  const clearAlerts = () => {
    setWeatherAlerts([]);
  };

  const dismissAlert = (alertId: string) => {
    setWeatherAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const contextValue: WeatherContextType = {
    weatherData,
    weatherAlerts,
    isLoading,
    error,
    isMonitoring,
    apiKey,
    location,
    setApiKey,
    setLocation,
    setLocationByCity,
    startMonitoring,
    stopMonitoring,
    refreshWeatherData,
    clearAlerts,
    dismissAlert
  };

  return (
    <WeatherContext.Provider value={contextValue}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

export default WeatherContext;