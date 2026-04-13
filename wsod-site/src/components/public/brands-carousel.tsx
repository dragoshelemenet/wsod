"use client";

import { useState } from "react";

type BrandsCarouselItem = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
};

type BrandsCarouselProps = {
  items: BrandsCarouselItem[];
};

export function BrandsCarousel({ items }: BrandsCarouselProps) {
  const validItems = items.filter((item) => item.imageUrl);

  const [index, setIndex] = useState(0);

  if (!validItems.length) {
    return null;
  }

  const visible = [
    validItems[index % validItems.length],
    validItems[(index + 1) % validItems.length],
    validItems[(index + 2) % validItems.length],
  ];

  function prev() {
    setIndex((current) => (current - 1 + validItems.length) % validItems.length);
  }

  function next() {
    setIndex((current) => (current + 1) % validItems.length);
  }

  return (
    <section className="brands-carousel">
      <div className="brands-carousel-head">
        <button type="button" className="brands-carousel-arrow" onClick={prev}>
          &lt;
        </button>

        <h2>BRANDS WE WORKED WITH</h2>

        <button type="button" className="brands-carousel-arrow" onClick={next}>
          &gt;
        </button>
      </div>

      <div className="brands-carousel-grid">
        {visible.map((brand) => (
          <a
            key={brand.id}
            href={`/brand/${brand.slug}`}
            className="reference-brand-v2-card"
          >
            <div className="reference-folder-v2-tab small" />
            <div
              className="reference-brand-v2-art"
              style={
                brand.imageUrl
                  ? {
                      backgroundImage: `linear-gradient(rgba(20,20,24,0.34), rgba(20,20,24,0.34)), url(${brand.imageUrl})`,
                    }
                  : undefined
              }
            />
            <div className="reference-brand-v2-name">{brand.name}</div>
          </a>
        ))}
      </div>

      <div className="reference-brands-dots">
        {validItems.map((item, itemIndex) => (
          <button
            key={item.id}
            type="button"
            className={`brands-dot ${itemIndex === index ? "is-active" : ""}`}
            onClick={() => setIndex(itemIndex)}
            aria-label={item.name}
          />
        ))}
      </div>
    </section>
  );
}
