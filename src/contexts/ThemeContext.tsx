import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type WeatherTheme = 'sunny' | 'cloudy' | 'rainy' | 'cold' | 'morning' | 'evening' | 'night';

interface WeatherData {
  main: string;
  description: string;
  temp: number;
  humidity: number;
  city: string;
  country: string;
}

interface ThemeContextType {
  theme: WeatherTheme;
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  location: { lat: number; lon: number } | null;
  city: string | null;
  setCity: (city: string) => void;
  setLocationFromCoords: (lat: number, lon: number) => void;
  setCountryFromPhone: (countryCode: string) => void;
  refreshWeather: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Map country codes to default cities
const countryToCityMap: Record<string, string> = {
  '+91': 'New Delhi',
  '+1': 'New York',
  '+44': 'London',
  '+86': 'Beijing',
  '+81': 'Tokyo',
  '+49': 'Berlin',
  '+33': 'Paris',
  '+61': 'Sydney',
  '+55': 'São Paulo',
  '+7': 'Moscow',
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<WeatherTheme>('sunny');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [city, setCityState] = useState<string | null>(null);

  const fetchWeather = useCallback(async (params: { lat?: number; lon?: number; city?: string }) => {
    if (!params.lat && !params.lon && !params.city) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const body: Record<string, unknown> = {};
      if (params.lat && params.lon) {
        body.lat = params.lat;
        body.lon = params.lon;
      } else if (params.city) {
        body.city = params.city;
      }

      const { data, error: fnError } = await supabase.functions.invoke('get-weather', {
        body,
      });

      if (fnError) throw fnError;

      setTheme(data.theme as WeatherTheme);
      setWeatherData(data.weather);
    } catch (err) {
      console.error('Failed to fetch weather:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
      // Fallback to time-based theme
      const hour = new Date().getHours();
      if (hour >= 20 || hour < 6) setTheme('night');
      else if (hour >= 18) setTheme('evening');
      else if (hour >= 6 && hour < 9) setTheme('morning');
      else setTheme('sunny');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setLocationFromCoords = useCallback((lat: number, lon: number) => {
    setLocation({ lat, lon });
    setCityState(null);
    fetchWeather({ lat, lon });
  }, [fetchWeather]);

  const setCity = useCallback((newCity: string) => {
    setCityState(newCity);
    setLocation(null);
    fetchWeather({ city: newCity });
  }, [fetchWeather]);

  const setCountryFromPhone = useCallback((countryCode: string) => {
    const defaultCity = countryToCityMap[countryCode] || 'London';
    setCity(defaultCity);
  }, [setCity]);

  const refreshWeather = useCallback(() => {
    if (location) {
      fetchWeather({ lat: location.lat, lon: location.lon });
    } else if (city) {
      fetchWeather({ city });
    }
  }, [location, city, fetchWeather]);

  // Auto-refresh weather every 30 minutes
  useEffect(() => {
    const interval = setInterval(refreshWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshWeather]);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-sunny', 'theme-cloudy', 'theme-rainy', 'theme-cold', 'theme-morning', 'theme-evening', 'theme-night');
    
    // Only tint once we actually have weather; otherwise keep the base terminal palette
    if (weatherData) {
      root.classList.add(`theme-${theme}`);
    }

    // The app shell is always dark (terminal aesthetic); weather themes only re-tint it
    root.classList.add('dark');
  }, [theme, weatherData]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        weatherData,
        isLoading,
        error,
        location,
        city,
        setCity,
        setLocationFromCoords,
        setCountryFromPhone,
        refreshWeather,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
