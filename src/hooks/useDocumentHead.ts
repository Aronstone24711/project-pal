import { useEffect } from "react";

/**
 * Lightweight replacement for react-helmet (which is not React 18 safe and
 * spams "Function components cannot be given refs" warnings).
 */
export const useDocumentHead = (title: string, description?: string) => {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      const set = (selector: string, attr: string, value: string) => {
        let el = document.head.querySelector<HTMLMetaElement>(selector);
        if (!el) {
          el = document.createElement("meta");
          el.setAttribute(attr, selector.replace(/^meta\[[^=]+="|"\]$/g, ""));
          document.head.appendChild(el);
        }
        el.setAttribute("content", value);
      };
      set('meta[name="description"]', "name", description);
      set('meta[property="og:description"]', "property", description);
    }

    const og = document.head.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (og && title) og.setAttribute("content", title);
  }, [title, description]);
};
