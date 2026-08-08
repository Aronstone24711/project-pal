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
  programmingEnv?: string;
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

export const useCustomBoards = () => {
  const [boards, setBoards] = useState<CustomBoard[]>([]);

  useEffect(() => {
    setBoards(read());
  }, []);

  const persist = useCallback((next: CustomBoard[]) => {
    setBoards(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addBoard = useCallback(
    (board: Omit<CustomBoard, "id" | "createdAt">) => {
      const next = [
        { ...board, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
        ...read().filter((b) => b.name.toLowerCase() !== board.name.toLowerCase()),
      ];
      persist(next);
    },
    [persist]
  );

  const removeBoard = useCallback(
    (id: string) => persist(read().filter((b) => b.id !== id)),
    [persist]
  );

  return { boards, addBoard, removeBoard };
};
