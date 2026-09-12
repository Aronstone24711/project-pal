import { useCallback, useEffect, useState } from "react";

export interface BuildJournalPost {
  id: string;
  title: string;
  description: string;
  author: string;
  image: string | null;
  createdAt: string;
}

const STORAGE_KEY = "searchall.buildJournal";

const readPosts = (): BuildJournalPost[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BuildJournalPost[]) : [];
  } catch {
    return [];
  }
};

let postsStore = readPosts();
const listeners = new Set<(posts: BuildJournalPost[]) => void>();

const commit = (next: BuildJournalPost[]) => {
  postsStore = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* Photo storage is best effort when browser storage is full. */
  }
  listeners.forEach((listener) => listener(next));
};

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      postsStore = readPosts();
      listeners.forEach((listener) => listener(postsStore));
    }
  });
}

export const useBuildJournal = () => {
  const [posts, setPosts] = useState<BuildJournalPost[]>(postsStore);

  useEffect(() => {
    listeners.add(setPosts);
    setPosts(postsStore);
    return () => listeners.delete(setPosts);
  }, []);

  const addPost = useCallback((post: Omit<BuildJournalPost, "id" | "createdAt">) => {
    const created: BuildJournalPost = {
      ...post,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    commit([created, ...postsStore]);
    return created;
  }, []);

  const removePost = useCallback((id: string) => {
    commit(postsStore.filter((post) => post.id !== id));
  }, []);

  return { posts, addPost, removePost };
};