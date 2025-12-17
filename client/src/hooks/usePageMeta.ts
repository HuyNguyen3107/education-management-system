import { useEffect } from "react";

export const usePageMeta = (title?: string, description?: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    const prevDescription = document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content");

    const effectiveTitle =
      title || "Hệ thống quản lý đào tạo - Education Management System";

    const effectiveDescription =
      description ||
      (title
        ? `${title} - Hệ thống quản lý đào tạo EMS.`
        : "Hệ thống quản lý đào tạo EMS dành cho sinh viên, giảng viên và quản trị viên.");

    if (effectiveTitle) document.title = effectiveTitle;

    if (effectiveDescription) {
      let descTag = document.querySelector('meta[name="description"]');
      if (!descTag) {
        descTag = document.createElement("meta");
        descTag.setAttribute("name", "description");
        document.head.appendChild(descTag);
      }
      descTag.setAttribute("content", effectiveDescription);
    }

    return () => {
      // restore previous values to avoid side-effects when unmounting
      if (typeof prevTitle === "string") document.title = prevTitle;
      if (prevDescription != null) {
        let descTag = document.querySelector('meta[name="description"]');
        if (descTag) descTag.setAttribute("content", prevDescription);
      }
    };
  }, [title, description]);
};
