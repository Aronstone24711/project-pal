import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";
import type { Connection } from "@/types/arduino";
import { wireHex, wireTextColor } from "./wireColors";

interface ConnectionListProps {
  connections: Connection[];
}

/** Text-first wiring table — the primary, always-available representation. */
const ConnectionList = ({ connections }: ConnectionListProps) => {
  if (!connections?.length) return null;

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-foreground flex items-center gap-2">
        <Wrench className="w-4 h-4" />
        Connections
      </h4>
      <div className="space-y-2">
        {connections.map((conn, idx) => (
          <div key={`${conn.from}-${conn.to}-${idx}`} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Badge variant="outline" className="shrink-0">{conn.from}</Badge>
            <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30 relative">
              {conn.wireColor && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 -top-3 text-xs px-2 py-0.5 rounded"
                  style={{ backgroundColor: wireHex(conn.wireColor), color: wireTextColor(conn.wireColor) }}
                >
                  {conn.wireColor}
                </span>
              )}
            </div>
            <Badge variant="outline" className="shrink-0">{conn.to}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(ConnectionList);
