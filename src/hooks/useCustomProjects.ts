import { useCallback, useEffect, useState } from "react";
import type { ProjectInstructions } from "@/types/arduino";

export interface CustomProject {
  id: string;
  name: string;
  description: string;
  device: string;
  components: string;
  createdAt: string;
  /** AI-generated build plan, cached so it opens offline too. */
  plan?: ProjectInstructions | null;
}

const STORAGE_KEY = "searchall.customProjects";

const read = (): CustomProject[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CustomProject[]) : [];
  } catch {
    return [];
  }
};

/** Single shared store so every mounted component stays in sync. */
let store: CustomProject[] = read();
const listeners = new Set<(next: CustomProject[]) => void>();

const commit = (next: CustomProject[]) => {
  store = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota errors */
  }
  listeners.forEach((listener) => listener(next));
};

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      store = read();
      listeners.forEach((listener) => listener(store));
    }
  });
}

export const useCustomProjects = () => {
  const [projects, setProjects] = useState<CustomProject[]>(store);

  useEffect(() => {
    listeners.add(setProjects);
    setProjects(store);
    return () => {
      listeners.delete(setProjects);
    };
  }, []);

  const addProject = useCallback(
    (project: Omit<CustomProject, "id" | "createdAt">) => {
      const created: CustomProject = {
        ...project,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      commit([created, ...store]);
      return created;
    },
    []
  );

  const updateProject = useCallback((id: string, patch: Partial<CustomProject>) => {
    commit(store.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const removeProject = useCallback((id: string) => {
    commit(store.filter((p) => p.id !== id));
  }, []);

  return { projects, addProject, updateProject, removeProject };
};
