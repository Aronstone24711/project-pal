import { useCallback, useEffect, useState } from "react";

export interface BoardDetails {
  name?: string;
  family?: string;
  mcu?: string;
  logicVoltage?: string;
  digitalPins?: string;
  analogPins?: string;
  pwmPins?: string;
  communication?: string[];
  programmingEnv?: string | string[];
  capabilities?: string[];
  commonUses?: string[];
  cautions?: string[];
  notes?: string;
}

export interface CustomBoard {
  id: string;
  name: string;
  source: "online" | "offline";
  details?: BoardDetails;
  createdAt: string;
}

const STORAGE_KEY = "searchall.customBoards";

const read = (): CustomBoard[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CustomBoard[]) : [];
  } catch {
    return [];
  }
};

// Shared store so every component using this hook stays in sync
const listeners = new Set<(boards: CustomBoard[]) => void>();

const write = (next: CustomBoard[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }
  listeners.forEach((l) => l(next));
};

export const useCustomBoards = () => {
  const [boards, setBoards] = useState<CustomBoard[]>([]);

  useEffect(() => {
    setBoards(read());
    const listener = (next: CustomBoard[]) => setBoards(next);
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setBoards(read());
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const persist = useCallback((next: CustomBoard[]) => write(next), []);

  const addBoard = useCallback(
    (board: Omit<CustomBoard, "id" | "createdAt">) => {
      const next = [
        { ...board, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
        ...read().filter((b) => b.name.toLowerCase() !== board.name.toLowerCase()),
      ];
      persist(next);
      return next;
    },
    [persist]
  );

  const removeBoard = useCallback(
    (id: string) => persist(read().filter((b) => b.id !== id)),
    [persist]
  );

  return { boards, addBoard, removeBoard };
};
