import { useCallback, useEffect, useState } from "react";

const KEY = "searchall.breadboardView";

/** Opt-in preference for the optional breadboard visual. Off by default. */
export const useBreadboardPreference = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try {
      setEnabled(localStorage.getItem(KEY) === "1");
    } catch {
      /* storage blocked */
    }
  }, []);

  const setPreference = useCallback((next: boolean) => {
    setEnabled(next);
    try {
      localStorage.setItem(KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  return { enabled, setPreference };
};
