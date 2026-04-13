"use client";

import { useMemo, useState } from "react";

type MediaCarouselItem = {
  id: string;
  title: string;
  imageUrl: string | null;
  href?: string;
};

type MediaCarouselProps = {
  items: MediaCarouselItem[];
};

export function MediaCarousel({ items }: MediaCarouselProps) {
  const validItems = useMemo(
    () => items.filter((item) => item.imageUrl),
    [items]
  );

  const [index, setIndex] = useState(0);

  if (!validItems.length) {
    return null;
  }

  const current = validItems[index];

  function goPrev() {
    setIndex((prev) => (prev - 1 + validItems.length) % validItems.length);
  }

  function goNext() {
    setIndex((prev) => (prev + 1) % validItems.length);
  }

  return (
    <section className="media-carousel">
      <div className="media-carousel-main">
        <button type="button" className="media-carousel-arrow left" onClick={goPrev}>
          &lt;
        </button>

        <div className="media-carousel-frame">
          {current.href ? (
            <a href={current.href}>
              <img src={current.imageUrl || ""} alt={current.title} className="media-carousel-image" />
            </a>
          ) : (
            <img src={current.imageUrl || ""} alt={current.title} className="media-carousel-image" />
          )}
        </div>

        <button type="button" className="media-carousel-arrow right" onClick={goNext}>
          &gt;
        </button>
      </div>

      <div className="media-carousel-strip">
        {validItems.map((item, itemIndex) => (
          <button
            key={item.id}
            type="button"
            className={`media-carousel-dot ${itemIndex === index ? "is-active" : ""}`}
            onClick={() => setIndex(itemIndex)}
            aria-label={item.title}
          />
        ))}
      </div>
    </section>
  );
}
