"use client";

import { useEffect, useMemo, useState } from "react";
import MediaCard from "@/components/media/MediaCard";
import { DbMediaCardItem } from "@/lib/types";

interface MediaGridProps {
  items: DbMediaCardItem[];
  emptyText: string;
}

export default function MediaGrid({ items, emptyText }: MediaGridProps) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth <= 640) {
        setPerPage(6);
      } else {
        setPerPage(10);
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
    <div className="media-grid-block">
      <div className="media-grid">
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
            onClick={() =>
              setPage((current) => Math.min(totalPages, current + 1))
            }
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
