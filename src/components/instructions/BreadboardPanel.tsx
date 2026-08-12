import { Suspense, lazy } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, LayoutGrid } from "lucide-react";
import type { Connection } from "@/types/arduino";
import { useBreadboardPreference } from "@/hooks/useBreadboardPreference";

// Loaded only once the user opts in, so it costs nothing by default.
const BreadboardView = lazy(() => import("./BreadboardView"));

interface BreadboardPanelProps {
  connections: Connection[];
}

/** Collapsed, opt-in enhancement: the wiring list stays the source of truth. */
const BreadboardPanel = ({ connections }: BreadboardPanelProps) => {
  const { enabled, setPreference } = useBreadboardPreference();

  if (!connections?.length) return null;

  return (
    <div className="rounded-lg border border-dashed border-border p-3">
      <div className="flex items-center justify-between gap-3">
        <Label
          htmlFor="breadboard-toggle"
          className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer"
        >
          <LayoutGrid className="w-4 h-4 text-primary" />
          Breadboard sketch
          <span className="text-[11px] font-mono opacity-70">optional</span>
        </Label>
        <Switch
          id="breadboard-toggle"
          checked={enabled}
          onCheckedChange={setPreference}
          aria-label="Show optional breadboard sketch"
        />
      </div>

      {enabled && (
        <div className="mt-3">
          <Suspense
            fallback={
              <div className="flex items-center gap-2 py-6 text-xs text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> drawing sketch…
              </div>
            }
          >
            <BreadboardView connections={connections} />
          </Suspense>
          <p className="mt-2 text-[11px] text-muted-foreground">
            A simplified helper view. Always follow the connection list above when wiring.
          </p>
        </div>
      )}
    </div>
  );
};

export default BreadboardPanel;
