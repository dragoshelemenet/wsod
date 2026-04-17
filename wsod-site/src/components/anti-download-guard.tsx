"use client";

import { useEffect } from "react";

export default function AntiDownloadGuard() {
  useEffect(() => {
    const preventContextMenu = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("img, video, canvas, picture, svg")) {
        event.preventDefault();
      }
    };

    const preventDragStart = (event: DragEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("img, video, canvas, picture, svg, a")) {
        event.preventDefault();
      }
    };

    const preventSaveKeys = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (
        (event.ctrlKey || event.metaKey) &&
        (key === "s" || key === "u" || key === "p")
      ) {
        event.preventDefault();
      }

      if (key === "printscreen") {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("dragstart", preventDragStart);
    document.addEventListener("keydown", preventSaveKeys);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("dragstart", preventDragStart);
      document.removeEventListener("keydown", preventSaveKeys);
    };
  }, []);

  return null;
}
