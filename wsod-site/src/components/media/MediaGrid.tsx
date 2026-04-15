"use client";

import { useEffect, useMemo, useState } from "react";
import MediaCard from "@/components/media/MediaCard";
import { DbMediaCardItem } from "@/lib/types";

interface MediaGridProps {
  items: DbMediaCardItem[];
  emptyText: string;
  variant?: "default" | "compact-photos";
}

function getCompactPhotoColumns(width: number) {
  if (width <= 700) return 3;
  if (width <= 900) return 4;
  if (width <= 1200) return 5;
  return 6;
}

export default function MediaGrid({
  items,
  emptyText,
  variant = "default",
}: MediaGridProps) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);

  useEffect(() => {
    const update = () => {
      if (variant === "compact-photos") {
        const columns = getCompactPhotoColumns(window.innerWidth);
        setPerPage(columns * 2);
        return;
      }

      if (window.innerWidth <= 640) {
        setPerPage(4);
      } else if (window.innerWidth <= 980) {
        setPerPage(8);
      } else {
        setPerPage(9);
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [variant]);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const visibleItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, page, perPage]);

  if (!items.length) {
    return <p className="empty-state">{emptyText}</p>;
  }

  return (
    <div className={`media-grid-block media-grid-block-${variant}`}>
      <div className={`media-grid media-grid-${variant}`}>
        {visibleItems.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="grid-pagination">
          <button
            type="button"
            className="grid-page-btn"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            aria-label="Pagina precedentă"
          >
            ‹
          </button>

          <span className="grid-page-indicator">
            {page} / {totalPages}
          </span>

          <button
            type="button"
            className="grid-page-btn"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            aria-label="Pagina următoare"
          >
            ›
          </button>
        </div>
      ) : null}
    </div>
  );
}
