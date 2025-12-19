import { useTheme, WeatherTheme } from '@/contexts/ThemeContext';
import { Sun, Cloud, CloudRain, Snowflake, Sunrise, Sunset, Moon, RefreshCw, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const themeIcons: Record<WeatherTheme, React.ReactNode> = {
  sunny: <Sun className="w-5 h-5 text-yellow-500" />,
  cloudy: <Cloud className="w-5 h-5 text-gray-400" />,
  rainy: <CloudRain className="w-5 h-5 text-blue-400" />,
  cold: <Snowflake className="w-5 h-5 text-cyan-400" />,
  morning: <Sunrise className="w-5 h-5 text-orange-400" />,
  evening: <Sunset className="w-5 h-5 text-orange-500" />,
  night: <Moon className="w-5 h-5 text-indigo-400" />,
};

const WeatherDisplay = () => {
  const { theme, weatherData, isLoading, refreshWeather } = useTheme();

  if (!weatherData) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/50 backdrop-blur-sm">
        {themeIcons[theme]}
        <span className="hidden sm:inline">{weatherData.temp}°C</span>
      </div>
      <div className="hidden md:flex items-center gap-1 text-muted-foreground">
        <MapPin className="w-3 h-3" />
        <span className="text-xs">{weatherData.city}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={refreshWeather}
        disabled={isLoading}
      >
        <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
};

export default WeatherDisplay;
