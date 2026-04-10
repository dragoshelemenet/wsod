"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  imageSrc?: string | null;
  videoSrc?: string | null;
};

function isVideo(src?: string | null) {
  if (!src) return false;
  const clean = src.split("?")[0].toLowerCase();
  return [".mp4", ".webm", ".mov", ".m4v", ".ogg"].some((ext) =>
    clean.endsWith(ext)
  );
}

function mod(index: number, length: number) {
  return ((index % length) + length) % length;
}

export default function HomeServicesCarouselClient({
  slides,
}: {
  slides: Slide[];
}) {
  const baseSlides = useMemo(() => slides.filter(Boolean), [slides]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (baseSlides.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((current) => mod(current + 1, baseSlides.length));
    }, 3000);

    return () => clearInterval(interval);
  }, [baseSlides.length]);

  if (!baseSlides.length) return null;

  const current = baseSlides[index];
  const prev = baseSlides[mod(index - 1, baseSlides.length)];
  const next = baseSlides[mod(index + 1, baseSlides.length)];

  const renderCard = (
    slide: Slide,
    variant: "prev" | "current" | "next"
  ) => (
    <Link
      href={slide.href}
      className={`services-carousel-card services-carousel-card-${variant}`}
      key={`${variant}-${slide.id}-${index}`}
    >
      <div className="services-carousel-media">
        {slide.videoSrc && isVideo(slide.videoSrc) ? (
          <video
            src={slide.videoSrc}
            className="services-carousel-media-el"
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            poster={slide.imageSrc || undefined}
          />
        ) : slide.imageSrc ? (
          <img
            src={slide.imageSrc}
            alt={slide.title}
            className="services-carousel-media-el"
            loading="lazy"
          />
        ) : (
          <div className="services-carousel-media-fallback">{slide.title}</div>
        )}

        <div className="services-carousel-overlay" />

        <div className="services-carousel-text">
          <h3>{slide.title}</h3>
          <p>{slide.subtitle}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="services-carousel-shell services-carousel-shell-peek">
      <div className="services-carousel-stage">
        {baseSlides.length > 1 ? renderCard(prev, "prev") : null}
        {renderCard(current, "current")}
        {baseSlides.length > 1 ? renderCard(next, "next") : null}
      </div>

      {baseSlides.length > 1 ? (
        <div className="services-carousel-dots" aria-hidden="true">
          {baseSlides.map((slide, dotIndex) => (
            <button
              key={slide.id}
              type="button"
              className={`services-carousel-dot ${
                index === dotIndex ? "is-active" : ""
              }`}
              onClick={() => setIndex(dotIndex)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
