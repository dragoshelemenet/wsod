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

export default function HomeServicesCarouselClient({
  slides,
}: {
  slides: Slide[];
}) {
  const baseSlides = slides.filter(Boolean);
  const extendedSlides = useMemo(() => {
    if (baseSlides.length <= 1) return baseSlides;
    return [...baseSlides, baseSlides[0]];
  }, [baseSlides]);

  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (baseSlides.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((current) => current + 1);
    }, 2800);

    return () => clearInterval(interval);
  }, [baseSlides.length]);

  useEffect(() => {
    if (baseSlides.length <= 1) return;
    if (index !== extendedSlides.length - 1) return;

    timeoutRef.current = setTimeout(() => {
      setAnimate(false);
      setIndex(0);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimate(true);
        });
      });
    }, 420);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, extendedSlides.length, baseSlides.length]);

  if (!baseSlides.length) return null;

  return (
    <div className="services-carousel-shell">
      <div className="services-carousel-viewport">
        <div
          className={`services-carousel-track ${animate ? "is-animated" : ""}`}
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {extendedSlides.map((slide, slideIndex) => (
            <div className="services-carousel-slide" key={`${slide.id}-${slideIndex}`}>
              <Link href={slide.href} className="services-carousel-card">
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
          ))}
        </div>
      </div>

      {baseSlides.length > 1 ? (
        <div className="services-carousel-dots" aria-hidden="true">
          {baseSlides.map((slide, dotIndex) => {
            const activeIndex = index >= baseSlides.length ? 0 : index;

            return (
              <button
                key={slide.id}
                type="button"
                className={`services-carousel-dot ${
                  activeIndex === dotIndex ? "is-active" : ""
                }`}
                onClick={() => setIndex(dotIndex)}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
