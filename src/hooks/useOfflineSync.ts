import { useCallback, useEffect, useRef, useState } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

/**
 * Drains a queue of pending items once connectivity returns.
 * Runs one item at a time so a slow backend never stampedes on reconnect.
 */
export const useOfflineSync = <T extends { id: string }>(
  pending: T[],
  process: (item: T) => Promise<void>,
) => {
  const online = useOnlineStatus();
  const [syncing, setSyncing] = useState(false);
  const runningRef = useRef(false);
  const doneRef = useRef<Set<string>>(new Set());
  const processRef = useRef(process);
  processRef.current = process;

  const drain = useCallback(async (items: T[]) => {
    if (runningRef.current) return;
    runningRef.current = true;
    setSyncing(true);
    try {
      for (const item of items) {
        if (doneRef.current.has(item.id) || !navigator.onLine) continue;
        doneRef.current.add(item.id);
        try {
          await processRef.current(item);
        } catch {
          // failed items may be retried on the next reconnect
          doneRef.current.delete(item.id);
        }
      }
    } finally {
      runningRef.current = false;
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (!online || pending.length === 0) return;
    void drain(pending);
  }, [online, pending, drain]);

  return { syncing, pendingCount: pending.length };
};
