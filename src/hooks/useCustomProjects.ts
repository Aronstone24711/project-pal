import { useCallback, useEffect, useState } from "react";

export interface CustomProject {
  id: string;
  name: string;
  description: string;
  device: string;
  components: string;
  createdAt: string;
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

export const useCustomProjects = () => {
  const [projects, setProjects] = useState<CustomProject[]>([]);

  useEffect(() => {
    setProjects(read());
  }, []);

  const persist = useCallback((next: CustomProject[]) => {
    setProjects(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const addProject = useCallback(
    (project: Omit<CustomProject, "id" | "createdAt">) => {
      const next = [
        {
          ...project,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        },
        ...read(),
      ];
      persist(next);
    },
    [persist]
  );

  const removeProject = useCallback(
    (id: string) => persist(read().filter((p) => p.id !== id)),
    [persist]
  );

  return { projects, addProject, removeProject };
};
