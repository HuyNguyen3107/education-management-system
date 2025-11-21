import { useEffect } from "react";

export const usePageMeta = (title?: string, description?: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    const prevDescription = document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content");

    if (title) document.title = title;
    if (description) {
      let descTag = document.querySelector('meta[name="description"]');
      if (!descTag) {
        descTag = document.createElement("meta");
        descTag.setAttribute("name", "description");
        document.head.appendChild(descTag);
      }
      descTag.setAttribute("content", description);
    }

    return () => {
      // restore previous values to avoid side-effects when unmounting
      if (typeof prevTitle === "string") document.title = prevTitle;
      if (prevDescription != null) {
        // prevDescription is now checked for null, so it's safe to use as string
        let descTag = document.querySelector('meta[name="description"]');
        if (descTag) descTag.setAttribute("content", prevDescription);
      }
    };
  }, [title, description]);
};
