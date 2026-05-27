import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, Locate, Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

const popularCities = [
  { name: 'Mumbai', country: 'India' },
  { name: 'Delhi', country: 'India' },
  { name: 'Ambala', country: 'India' },
  { name: 'Bangalore', country: 'India' },
  { name: 'Chennai', country: 'India' },
  { name: 'Kolkata', country: 'India' },
  { name: 'New York', country: 'USA' },
  { name: 'London', country: 'UK' },
];

interface LocationSelectorProps {
  onLocationSet: () => void;
}

const LocationSelector = ({ onLocationSet }: LocationSelectorProps) => {
  const { setCity, setLocationFromCoords, isLoading, weatherData } = useTheme();
  const { toast } = useToast();
  const [searchCity, setSearchCity] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location detection. Please search for your city manually.",
        variant: "destructive",
      });
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationFromCoords(position.coords.latitude, position.coords.longitude);
        setIsDetecting(false);
        onLocationSet();
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsDetecting(false);
        toast({
          title: "Location access denied",
          description: "Please allow location access or search for your city manually.",
          variant: "destructive",
        });
      }
    );
  };

  const handleCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setCity(searchCity.trim());
      onLocationSet();
    }
  };

  const handleCitySelect = (cityName: string) => {
    setCity(cityName);
    onLocationSet();
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Set Your Location</CardTitle>
          <CardDescription>
            We'll customize the app theme based on your local weather and time of day
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto-detect button */}
          <Button
            onClick={handleAutoDetect}
            disabled={isDetecting || isLoading}
            className="w-full"
            size="lg"
          >
            {isDetecting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Detecting location...
              </>
            ) : (
              <>
                <Locate className="w-5 h-5 mr-2" />
                Auto-detect my location
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or search</span>
            </div>
          </div>

          {/* City search */}
          <form onSubmit={handleCitySearch} className="flex gap-2">
            <Input
              placeholder="Enter city name..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!searchCity.trim() || isLoading}>
              <Search className="w-4 h-4" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">popular cities</span>
            </div>
          </div>

          {/* Popular cities grid */}
          <div className="grid grid-cols-2 gap-2">
            {popularCities.map((city) => (
              <Button
                key={city.name}
                variant="outline"
                size="sm"
                onClick={() => handleCitySelect(city.name)}
                disabled={isLoading}
                className="justify-start"
              >
                <MapPin className="w-3 h-3 mr-2" />
                {city.name}
              </Button>
            ))}
          </div>

          {weatherData && (
            <div className="text-center text-sm text-muted-foreground">
              Current: {weatherData.city}, {weatherData.country} - {weatherData.temp}°C, {weatherData.description}
            </div>
          )}

          <div className="pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={onLocationSet}
              className="w-full border-dashed border-2 hover:border-solid"
            >
              Continue without location →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationSelector;
