"use client";

import { useEffect, useMemo, useState } from "react";
import OwnerFolderCard from "@/components/media/OwnerFolderCard";

interface FolderOwnerItem {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  previewImages?: string[];
  subtitle?: string;
  href: string;
}

interface OwnerFolderGridProps {
  title: string;
  items: FolderOwnerItem[];
  emptyText?: string;
  variant?: "default" | "compact-file";
  ownerType?: "brand" | "model";
}

export default function OwnerFolderGrid({
  title,
  items,
  emptyText = "Nu există elemente momentan.",
  variant = "default",
  ownerType,
}: OwnerFolderGridProps) {
  const isCompact = variant === "compact-file";
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  const resolvedOwnerType: "brand" | "model" =
    ownerType ??
    (title.toLowerCase().includes("model") ? "model" : "brand");

  useEffect(() => {
    const update = () => {
      if (window.innerWidth <= 640) {
        setVisibleCount(2);
      } else if (window.innerWidth <= 1024) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!items.length) {
      setStartIndex(0);
      return;
    }

    if (startIndex >= items.length) {
      setStartIndex(0);
    }
  }, [items.length, startIndex]);

  const visibleItems = useMemo(() => {
    if (!items.length) return [];

    const output: FolderOwnerItem[] = [];
    for (let i = 0; i < Math.min(visibleCount, items.length); i += 1) {
      output.push(items[(startIndex + i) % items.length]);
    }
    return output;
  }, [items, startIndex, visibleCount]);

  const goPrev = () => {
    if (!items.length) return;
    setStartIndex((current) => (current - 1 + items.length) % items.length);
  };

  const goNext = () => {
    if (!items.length) return;
    setStartIndex((current) => (current + 1) % items.length);
  };

  return (
    <section className="owner-folder-section">
      <div className="owner-folder-section-head owner-folder-section-head-carousel">
        <h2>{title}</h2>

        {items.length > visibleCount ? (
          <div className="owner-folder-nav">
            <button
              type="button"
              className="owner-folder-nav-btn"
              onClick={goPrev}
              aria-label="Vezi precedentele"
            >
              ‹
            </button>
            <button
              type="button"
              className="owner-folder-nav-btn"
              onClick={goNext}
              aria-label="Vezi următoarele"
            >
              ›
            </button>
          </div>
        ) : null}
      </div>

      {!items.length ? (
        <p className="empty-state">{emptyText}</p>
      ) : (
        <div
          className={`owner-folder-grid owner-folder-grid-carousel${
            isCompact ? " owner-folder-grid-compact" : ""
          }`}
        >
          {visibleItems.map((item, index) => (
            <OwnerFolderCard
              key={`${item.id}-${index}`}
              title={item.name}
              href={item.href}
              subtitle={item.subtitle}
              imageUrl={item.imageUrl}
              previewImages={item.previewImages}
              compact={isCompact}
              variant={resolvedOwnerType}
            />
          ))}
        </div>
      )}
    </section>
  );
}
