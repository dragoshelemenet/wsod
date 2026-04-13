"use client";

import { useMemo, useState } from "react";

type GalleryItem = {
  id: string;
  title: string;
  src: string;
  thumb: string;
  rotation?: number;
};

type Props = {
  items: GalleryItem[];
};

export function FotoDetailGalleryClient({ items }: Props) {
  const safeItems = useMemo(() => items.filter((item) => item.src), [items]);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!safeItems.length) return null;

  const active = safeItems[activeIndex];
  const hasMany = safeItems.length > 1;

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + safeItems.length) % safeItems.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % safeItems.length);
  };

  return (
    <section className="foto-detail-gallery">
      <div className="foto-detail-stage">
        {hasMany ? (
          <button
            type="button"
            className="foto-detail-nav foto-detail-nav-prev"
            onClick={goPrev}
            aria-label="Previous image"
          >
            ‹
          </button>
        ) : null}

        <button
          type="button"
          className="foto-detail-main-button"
          onClick={hasMany ? goNext : undefined}
        >
          <img
            src={active.src}
            alt={active.title}
            className="foto-detail-main-image"
            style={{ transform: `rotate(${active.rotation ?? 0}deg)` }}
          />
        </button>

        {hasMany ? (
          <button
            type="button"
            className="foto-detail-nav foto-detail-nav-next"
            onClick={goNext}
            aria-label="Next image"
          >
            ›
          </button>
        ) : null}
      </div>

      {hasMany ? (
        <div className="foto-detail-thumb-grid">
          {safeItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`foto-detail-thumb-button ${index === activeIndex ? "is-active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={item.thumb}
                alt={item.title}
                className="foto-detail-thumb-image"
                style={{ transform: `rotate(${item.rotation ?? 0}deg)` }}
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
