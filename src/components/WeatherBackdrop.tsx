import { useTheme } from "@/contexts/ThemeContext";

/**
 * Full-screen translucent backdrop that re-tints with the live weather theme.
 * Purely presentational and GPU-cheap (two gradient layers + one animation).
 */
const WeatherBackdrop = () => {
  const { theme, weatherData } = useTheme();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 weather-aurora" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--primary) / 0.08), transparent 40%, hsl(var(--accent) / 0.07))",
        }}
      />
      <div className="absolute inset-0 grid-backdrop opacity-80" />
      {weatherData && (theme === "rainy" || theme === "cold") && (
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(105deg, hsl(var(--primary)) 0 1px, transparent 1px 9px)",
          }}
        />
      )}
    </div>
  );
};

export default WeatherBackdrop;