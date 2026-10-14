import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useOfflineSync } from "@/hooks/useOfflineSync";

interface ProgressState {
  completed: string[];
  lastLesson: string | null;
  board: string;
  pending: Array<{ id: string }>;
}

const KEY = "searchall.lessonProgress";
const read = (): ProgressState => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { completed: [], lastLesson: null, board: "Arduino", pending: [], ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { completed: [], lastLesson: null, board: "Arduino", pending: [] };
};

let store = read();
const listeners = new Set<(s: ProgressState) => void>();
const commit = (next: ProgressState) => {
  store = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage full */ }
  listeners.forEach((l) => l(next));
};

export const useLessonProgress = () => {
  const [state, setState] = useState(store);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    listeners.add(setState);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUserId(s?.user?.id ?? null));
    supabase.auth.getSession().then(({ data: { session } }) => setUserId(session?.user?.id ?? null));
    return () => { listeners.delete(setState); subscription.unsubscribe(); };
  }, []);

  // Pull remote progress once signed in and merge.
  useEffect(() => {
    if (!userId || !navigator.onLine) return;
    supabase.from("lesson_progress").select("lesson_id").then(({ data }) => {
      if (!data) return;
      const merged = Array.from(new Set([...store.completed, ...data.map((r) => r.lesson_id)]));
      commit({ ...store, completed: merged });
    });
  }, [userId]);

  useOfflineSync(userId ? state.pending : [], async (item) => {
    const done = store.completed.includes(item.id);
    const { error } = done
      ? await supabase.from("lesson_progress").upsert({ user_id: userId!, lesson_id: item.id }, { onConflict: "user_id,lesson_id" })
      : await supabase.from("lesson_progress").delete().eq("lesson_id", item.id);
    if (error) throw error;
    commit({ ...store, pending: store.pending.filter((p) => p.id !== item.id) });
  });

  const toggleComplete = useCallback((id: string) => {
    const done = store.completed.includes(id);
    commit({
      ...store,
      completed: done ? store.completed.filter((c) => c !== id) : [...store.completed, id],
      pending: [...store.pending.filter((p) => p.id !== id), { id }],
    });
  }, []);
  const setLastLesson = useCallback((id: string) => commit({ ...store, lastLesson: id }), []);
  const setBoard = useCallback((board: string) => commit({ ...store, board }), []);

  return { ...state, toggleComplete, setLastLesson, setBoard };
};
