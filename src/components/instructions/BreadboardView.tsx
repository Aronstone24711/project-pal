import { memo, useMemo } from "react";
import type { Connection } from "@/types/arduino";
import { wireHex } from "./wireColors";

interface BreadboardViewProps {
  connections: Connection[];
}

/**
 * Optional, opt-in breadboard sketch. Pure SVG derived from the wiring list —
 * no network calls, no images, nothing rendered unless the user turns it on.
 */
const BreadboardView = ({ connections }: BreadboardViewProps) => {
  const rows = useMemo(() => connections.slice(0, 10), [connections]);
  const height = 90 + rows.length * 34;

  return (
    <svg
      viewBox={`0 0 520 ${height}`}
      className="w-full h-auto rounded-lg border border-border bg-muted/30"
      role="img"
      aria-label="Simplified breadboard sketch of the wiring for this step"
    >
      {/* rails */}
      <rect x="18" y="18" width="484" height="10" rx="5" fill={wireHex("red")} opacity="0.35" />
      <text x="18" y="14" fontSize="9" fill="currentColor" opacity="0.6">+ power rail</text>
      <rect x="18" y={height - 28} width="484" height="10" rx="5" fill={wireHex("black")} opacity="0.5" />
      <text x="18" y={height - 32} fontSize="9" fill="currentColor" opacity="0.6">- ground rail</text>

      {rows.map((conn, idx) => {
        const y = 58 + idx * 34;
        return (
          <g key={`${conn.from}-${conn.to}-${idx}`}>
            <rect x="18" y={y - 12} width="150" height="24" rx="4" fill="currentColor" opacity="0.08" />
            <text x="26" y={y + 4} fontSize="11" fill="currentColor">{conn.from.slice(0, 22)}</text>
            <path
              d={`M168 ${y} C 240 ${y - 18}, 300 ${y + 18}, 352 ${y}`}
              stroke={wireHex(conn.wireColor)}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <rect x="352" y={y - 12} width="150" height="24" rx="4" fill="currentColor" opacity="0.08" />
            <text x="360" y={y + 4} fontSize="11" fill="currentColor">{conn.to.slice(0, 22)}</text>
          </g>
        );
      })}

      {connections.length > rows.length && (
        <text x="18" y={height - 40} fontSize="9" fill="currentColor" opacity="0.6">
          +{connections.length - rows.length} more connections listed above
        </text>
      )}
    </svg>
  );
};

export default memo(BreadboardView);
