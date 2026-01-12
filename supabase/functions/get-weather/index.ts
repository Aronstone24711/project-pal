import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lon, city } = await req.json();
    const apiKey = Deno.env.get('OPENWEATHERMAP_API_KEY');
    
    if (!apiKey) {
      throw new Error('Weather API key not configured');
    }

    let url: string;
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    } else {
      throw new Error('Either lat/lon or city is required');
    }

    console.log('Fetching weather from:', url.replace(apiKey, 'REDACTED'));

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error('Weather API error:', data);
      throw new Error(data.message || 'Failed to fetch weather');
    }

    // Determine theme based on weather and time
    const weatherMain = data.weather?.[0]?.main?.toLowerCase() || 'clear';
    const temp = data.main?.temp || 20;
    const timezone = data.timezone || 0; // UTC offset in seconds
    
    // Calculate local time at the location
    const utcTime = new Date();
    const localTime = new Date(utcTime.getTime() + (timezone * 1000));
    const hour = localTime.getUTCHours();

    let theme: string;
    let themeDescription: string;

    // Night time (8 PM - 6 AM)
    if (hour >= 20 || hour < 6) {
      theme = 'night';
      themeDescription = 'Starry galaxy night';
    }
    // Evening/Cold (6 PM - 8 PM)
    else if (hour >= 18) {
      theme = 'evening';
      themeDescription = 'Cool evening';
    }
    // Morning (6 AM - 9 AM)
    else if (hour >= 6 && hour < 9) {
      theme = 'morning';
      themeDescription = 'Fresh morning';
    }
    // Daytime - check weather
    else {
      if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
        theme = 'rainy';
        themeDescription = 'Rainy day';
      } else if (weatherMain.includes('smoke') || weatherMain.includes('haze') || weatherMain.includes('fog') || weatherMain.includes('mist')) {
        theme = 'cloudy';
        themeDescription = 'Hazy/Smoky';
      } else if (weatherMain.includes('cloud')) {
        theme = 'cloudy';
        themeDescription = 'Cloudy day';
      } else if (temp < 15) {
        theme = 'cold';
        themeDescription = 'Cool weather';
      } else {
        theme = 'sunny';
        themeDescription = 'Sunny day';
      }
    }

    const result = {
      theme,
      themeDescription,
      weather: {
        main: weatherMain,
        description: data.weather?.[0]?.description,
        temp: Math.round(temp * 10) / 10, // Keep one decimal for precision
        humidity: data.main?.humidity,
        city: data.name,
        country: data.sys?.country,
        feelsLike: data.main?.feels_like ? Math.round(data.main.feels_like * 10) / 10 : undefined,
      },
      localHour: hour,
    };

    console.log('Weather result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Weather function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get weather';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
