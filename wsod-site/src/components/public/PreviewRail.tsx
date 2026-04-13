"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";

type RailItem = {
  id: string;
  title: string;
  href: string;
  imageUrl: string | null;
  rotation?: number;
  showPlayIcon?: boolean;
};

type Props = {
  title: string;
  items: RailItem[];
};

export default function PreviewRail({ title, items }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const rowsClass = useMemo(() => {
    return items.length > 8 ? "preview-rail-grid is-two-rows" : "preview-rail-grid is-one-row";
  }, [items.length]);

  function scrollByAmount(direction: "left" | "right") {
    if (!ref.current) return;
    const amount = Math.max(ref.current.clientWidth * 0.88, 320);
    ref.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  if (!items.length) return null;

  return (
    <section className="inner-section-block">
      <div className="section-mini-head preview-rail-head">
        <h2>{title}</h2>

        <div className="preview-rail-controls">
          <button
            type="button"
            className="preview-rail-arrow"
            onClick={() => scrollByAmount("left")}
            aria-label={`Scroll left ${title}`}
          >
            ‹
          </button>

          <button
            type="button"
            className="preview-rail-arrow"
            onClick={() => scrollByAmount("right")}
            aria-label={`Scroll right ${title}`}
          >
            ›
          </button>
        </div>
      </div>

      <div className="preview-rail-shell">
        <div ref={ref} className="preview-rail-scroll">
          <div className={rowsClass}>
            {items.map((item) => (
              <Link key={item.id} href={item.href} className="preview-rail-card">
                <div className="preview-rail-card-image-wrap">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="preview-rail-card-image"
                    />
                  ) : (
                    <div className="preview-rail-card-empty">{item.title}</div>
                  )}

                  {item.showPlayIcon ? (
                    <span className="preview-rail-play" aria-hidden="true">
                      ▶
                    </span>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
