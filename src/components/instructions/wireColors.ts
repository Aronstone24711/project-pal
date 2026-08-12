/** Single source of truth for wire colour rendering (used by lists + breadboard). */
const WIRE_HEX: Record<string, string> = {
  red: "#ef4444",
  black: "#1f2937",
  yellow: "#eab308",
  green: "#22c55e",
  blue: "#3b82f6",
  orange: "#f97316",
  white: "#f3f4f6",
  purple: "#a855f7",
  brown: "#92400e",
};

const DARK_TEXT = new Set(["yellow", "white", "green"]);

export const wireHex = (color?: string) =>
  (color && WIRE_HEX[color.toLowerCase()]) || "#6b7280";

export const wireTextColor = (color?: string) =>
  color && DARK_TEXT.has(color.toLowerCase()) ? "#1f2937" : "#ffffff";
