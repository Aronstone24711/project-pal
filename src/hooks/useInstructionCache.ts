import { ProjectInstructions } from "@/types/arduino";

const KEY = "searchall.instructionCache";

type CacheShape = Record<string, { savedAt: string; data: ProjectInstructions }>;

const readAll = (): CacheShape => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as CacheShape;
  } catch {
    return {};
  }
};

export const instructionCacheKey = (
  projectName: string,
  language: string,
  level: string
) => `${projectName}::${language}::${level}`;

export const readCachedInstructions = (key: string): ProjectInstructions | null =>
  readAll()[key]?.data ?? null;

export const writeCachedInstructions = (key: string, data: ProjectInstructions) => {
  try {
    const all = readAll();
    all[key] = { savedAt: new Date().toISOString(), data };
    // keep the cache bounded (most recent 40 builds)
    const entries = Object.entries(all)
      .sort((a, b) => b[1].savedAt.localeCompare(a[1].savedAt))
      .slice(0, 40);
    localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch {
    /* storage full or unavailable — cache is best-effort */
  }
};