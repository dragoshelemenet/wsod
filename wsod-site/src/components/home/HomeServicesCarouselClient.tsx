"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const [isTouching, setIsTouching] = useState(false);
  const startXRef = useRef<number | null>(null);
  const deltaXRef = useRef(0);

  useEffect(() => {
    if (baseSlides.length <= 1 || isTouching) return;

    const interval = setInterval(() => {
      setIndex((current) => mod(current + 1, baseSlides.length));
    }, 3200);

    return () => clearInterval(interval);
  }, [baseSlides.length, isTouching]);

  if (!baseSlides.length) return null;

  const current = baseSlides[index];
  const prev = baseSlides[mod(index - 1, baseSlides.length)];
  const next = baseSlides[mod(index + 1, baseSlides.length)];

  const goPrev = () => setIndex((currentIndex) => mod(currentIndex - 1, baseSlides.length));
  const goNext = () => setIndex((currentIndex) => mod(currentIndex + 1, baseSlides.length));

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    startXRef.current = event.touches[0]?.clientX ?? null;
    deltaXRef.current = 0;
    setIsTouching(true);
  };

  const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (startXRef.current === null) return;
    const currentX = event.touches[0]?.clientX ?? startXRef.current;
    deltaXRef.current = currentX - startXRef.current;
  };

  const onTouchEnd = () => {
    const delta = deltaXRef.current;

    if (delta <= -45) goNext();
    if (delta >= 45) goPrev();

    startXRef.current = null;
    deltaXRef.current = 0;
    setIsTouching(false);
  };

  const renderCard = (
    slide: Slide,
    variant: "prev" | "current" | "next"
  ) => (
    <div
      className={`services-carousel-card services-carousel-card-${variant}`}
      key={`${variant}-${slide.id}-${index}`}
      onClick={
        variant === "prev" ? goPrev : variant === "next" ? goNext : undefined
      }
      role={variant === "current" ? undefined : "button"}
      tabIndex={variant === "current" ? undefined : 0}
      onKeyDown={(event) => {
        if (variant === "prev" && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          goPrev();
        }
        if (variant === "next" && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          goNext();
        }
      }}
      aria-label={
        variant === "prev"
          ? `Vezi anterior: ${slide.title}`
          : variant === "next"
            ? `Vezi următor: ${slide.title}`
            : undefined
      }
    >
      <Link
        href={slide.href}
        className="services-carousel-card-link"
        onClick={(event) => {
          if (variant !== "current") {
            event.preventDefault();
          }
        }}
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
    </div>
  );

  return (
    <div className="services-carousel-shell services-carousel-shell-peek">
      <div
        className="services-carousel-stage"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
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
