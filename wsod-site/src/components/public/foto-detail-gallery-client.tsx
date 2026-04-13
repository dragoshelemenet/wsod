"use client";

import { useEffect, useMemo, useState } from "react";

type GalleryItem = {
  id: string;
  title: string;
  src: string;
  thumb: string;
};

type Props = {
  items: GalleryItem[];
};

export function FotoDetailGalleryClient({ items }: Props) {
  const safeItems = useMemo(() => items.filter((item) => item.src), [items]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % safeItems.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + safeItems.length) % safeItems.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, safeItems.length]);

  if (!safeItems.length) return null;

  const active = safeItems[activeIndex];

  return (
    <>
      <section className="foto-detail-gallery">
        <button
          type="button"
          className="foto-detail-main-button"
          onClick={() => setOpen(true)}
        >
          <img
            src={active.src}
            alt={active.title}
            className="foto-detail-main-image"
          />
        </button>

        {safeItems.length > 1 ? (
          <div className="foto-detail-thumb-grid">
            {safeItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`foto-detail-thumb-button ${index === activeIndex ? "is-active" : ""}`}
                onClick={() => {
                  setActiveIndex(index);
                  setOpen(true);
                }}
              >
                <img
                  src={item.thumb}
                  alt={item.title}
                  className="foto-detail-thumb-image"
                />
              </button>
            ))}
          </div>
        ) : null}
      </section>

      {open ? (
        <div
          className="foto-lightbox"
          onClick={() => setOpen(false)}
        >
          <div
            className="foto-lightbox-dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="foto-lightbox-close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>

            {safeItems.length > 1 ? (
              <>
                <button
                  type="button"
                  className="foto-lightbox-nav foto-lightbox-nav-prev"
                  onClick={() =>
                    setActiveIndex((prev) => (prev - 1 + safeItems.length) % safeItems.length)
                  }
                >
                  ‹
                </button>

                <button
                  type="button"
                  className="foto-lightbox-nav foto-lightbox-nav-next"
                  onClick={() =>
                    setActiveIndex((prev) => (prev + 1) % safeItems.length)
                  }
                >
                  ›
                </button>
              </>
            ) : null}

            <img
              src={active.src}
              alt={active.title}
              className="foto-lightbox-image"
            />

            {safeItems.length > 1 ? (
              <div className="foto-lightbox-strip">
                {safeItems.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`foto-lightbox-strip-button ${index === activeIndex ? "is-active" : ""}`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <img
                      src={item.thumb}
                      alt={item.title}
                      className="foto-lightbox-strip-image"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
