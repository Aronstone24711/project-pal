import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Wifi, WifiOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCustomBoards, BoardDetails } from "@/hooks/useCustomBoards";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { toast } from "sonner";

interface AddBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language?: string;
}

const AddBoardDialog = ({ open, onOpenChange, language = "en" }: AddBoardDialogProps) => {
  const { addBoard } = useCustomBoards();
  const online = useOnlineStatus();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const boardName = name.trim();
    if (!boardName) return;

    if (!online) {
      addBoard({ name: boardName, source: "offline" });
      toast.info("Board saved offline. Connect to the internet to fetch full specs.");
      setName("");
      onOpenChange(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-components", {
        body: { action: "board_info", boardName, language },
      });
      if (error) throw error;
      const details = (data ?? {}) as BoardDetails & { error?: string };
      if (details.error) throw new Error(details.error);
      addBoard({ name: details.name || boardName, source: "online", details });
      toast.success(`${details.name || boardName} added with live specs.`);
      setName("");
      onOpenChange(false);
    } catch (err) {
      console.error("board_info failed:", err);
      addBoard({ name: boardName, source: "offline" });
      toast.warning("Couldn't reach the network — board saved offline instead.");
      setName("");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a board</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            {online ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-primary" /> Online — pins, voltage and capabilities are fetched automatically.
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" /> Offline — the board is saved locally and enriched later.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="board-name">Board name</Label>
            <Input
              id="board-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ESP8266 NodeMCU, Pi Pico W, Teensy 4.1…"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!name.trim() || loading} className="gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Fetching specs…" : "Add board"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBoardDialog;
