import { useState } from "react";
import { Button } from "@/components/ui/button";
import searchAllLogo from "@/assets/searchall-logo.png";
import { Wrench, ScanLine, ArrowRight, Cpu, Plus, Trash2, Wifi, WifiOff } from "lucide-react";
import CustomProjects from "@/components/CustomProjects";
import AddBoardDialog from "@/components/AddBoardDialog";
import { useCustomBoards } from "@/hooks/useCustomBoards";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

interface WelcomePageProps {
  onContinue: () => void;
  onDebug: () => void;
}

const boards = ["Arduino", "ESP32", "Raspberry Pi", "STM32"];

const WelcomePage = ({ onContinue, onDebug }: WelcomePageProps) => {
  const { boards: customBoards, removeBoard } = useCustomBoards();
  const online = useOnlineStatus();
  const [addBoardOpen, setAddBoardOpen] = useState(false);

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 grid-backdrop" aria-hidden="true" />

      <section className="max-w-5xl mx-auto pt-10 md:pt-16">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <p className="terminal-label">// scan · build · debug</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded border border-border px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
            {online ? (
              <>
                <Wifi className="w-3 h-3 text-primary" /> online mode
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" /> offline mode
              </>
            )}
          </span>
        </div>

        <h1 className="mt-8 font-display text-4xl md:text-6xl font-bold leading-[1.05]">
          Ship real projects,
          <br />
          <span className="text-primary">ten times faster.</span>
        </h1>

        <p className="mt-6 max-w-xl text-base text-muted-foreground">
          Search All scans the parts you already own — electronics, paper, household objects — then
          hands you buildable projects with wiring diagrams, working code and step-by-step visuals.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button size="lg" onClick={onContinue} className="gap-2">
            <ScanLine className="w-5 h-5" /> Start building <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={onDebug} className="gap-2">
            <Wrench className="w-5 h-5" /> Debug a project
          </Button>
        </div>

        <ul className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          {boards.map((board) => (
            <li key={board} className="rounded-lg border border-border bg-card p-4">
              <Cpu className="w-5 h-5 text-primary" />
              <p className="mt-3 font-display font-semibold">{board}</p>
              <p className="text-xs text-muted-foreground mt-1">Wiring + code</p>
            </li>
          ))}

          {customBoards.map((board) => (
            <li key={board.id} className="rounded-lg border border-border bg-card p-4 relative">
              <div className="flex items-start justify-between gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                <button
                  onClick={() => removeBoard(board.id)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label={`Remove ${board.name}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="mt-3 font-display font-semibold leading-tight">{board.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {board.details?.mcu || (board.source === "offline" ? "Saved offline" : "Wiring + code")}
              </p>
              {board.details?.logicVoltage && (
                <p className="text-[11px] font-mono text-primary mt-2">{board.details.logicVoltage}</p>
              )}
            </li>
          ))}

          <li>
            <button
              onClick={() => setAddBoardOpen(true)}
              className="w-full h-full min-h-[104px] rounded-lg border border-dashed border-border bg-transparent p-4 text-left hover:border-primary transition-colors"
            >
              <Plus className="w-5 h-5 text-primary" />
              <p className="mt-3 font-display font-semibold">Add board</p>
              <p className="text-xs text-muted-foreground mt-1">
                {online ? "Fetch specs online" : "Save offline for now"}
              </p>
            </button>
          </li>
        </ul>

        <div className="mt-14 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="w-8 h-8 rounded bg-background flex items-center justify-center overflow-hidden border border-border">
            <img src={searchAllLogo} alt="Search All logo" className="w-full h-full object-contain" />
          </span>
          Place Where Ideas Meet Innovation
        </div>
      </section>

      <CustomProjects />

      <AddBoardDialog open={addBoardOpen} onOpenChange={setAddBoardOpen} />
    </div>
  );
};

export default WelcomePage;
