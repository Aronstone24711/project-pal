import { useEffect } from "react";

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest("input, textarea, select, button, a, pre, code, [contenteditable='true']"));
};

/** Deters casual page copying without blocking forms or the app's copy-code buttons. */
export const useContentProtection = () => {
  useEffect(() => {
    const preventContextMenu = (event: MouseEvent) => {
      if (!isEditableTarget(event.target)) event.preventDefault();
    };
    const preventDrag = (event: DragEvent) => {
      if (!isEditableTarget(event.target)) event.preventDefault();
    };

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("dragstart", preventDrag);
    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("dragstart", preventDrag);
    };
  }, []);
};