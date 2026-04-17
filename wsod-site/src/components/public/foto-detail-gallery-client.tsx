"use client";

import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type GalleryItem = {
  id: string;
  title: string;
  displayTitle?: string;
  slug?: string;
  src: string;
  thumb: string;
  aiMode?: string;
};

type Props = {
  items: GalleryItem[];
  titleTargetId?: string;
};

function AiBadge({ mode }: { mode?: string }) {
  const isFullAi = mode === "ai";
  const title = isFullAi
    ? "Fotosesiune complet creată cu AI."
    : "Hainele sau unele elemente au fost schimbate cu AI.";
  const label = isFullAi ? "AI" : "AI EDIT";

  return (
    <div
      className="ai-photo-badge"
      data-ai-tooltip={title}
    >
      <span className="ai-photo-badge-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="ai-photo-badge-icon-svg">
          <path
            d="M12 3l1.9 4.6L18.5 9l-4.6 1.4L12 15l-1.9-4.6L5.5 9l4.6-1.4L12 3z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="ai-photo-badge-text">{label}</span>
    </div>
  );
}

export function FotoDetailGalleryClient({ items, titleTargetId }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const safeItems = useMemo(() => items.filter((item) => item.src), [items]);
  const currentSlug = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  }, [pathname]);

  const initialIndex = useMemo(() => {
    const foundIndex = safeItems.findIndex((item) => item.slug === currentSlug);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [safeItems, currentSlug]);

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const zoomResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (zoomResetTimer.current) {
      clearTimeout(zoomResetTimer.current);
      zoomResetTimer.current = null;
    }
    setActiveIndex(initialIndex);
    setIsZoomed(false);
    setZoomOrigin("50% 50%");
  }, [initialIndex]);

  useEffect(() => {
    return () => {
      if (zoomResetTimer.current) {
        clearTimeout(zoomResetTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!titleTargetId) return;
    const el = document.getElementById(titleTargetId);
    if (!el) return;
    const active = safeItems[activeIndex];
    if (!active) return;
    el.textContent = active.displayTitle || active.title;
  }, [activeIndex, safeItems, titleTargetId]);

  useEffect(() => {
    const active = safeItems[activeIndex];
    if (!active?.slug) return;
    if (currentSlug === active.slug) return;

    const parts = pathname.split("/").filter(Boolean);
    if (parts.length < 2) return;

    const nextPath = `/${parts[0]}/${active.slug}`;
    router.replace(nextPath, { scroll: false });
  }, [activeIndex, safeItems, pathname, router, currentSlug]);

  if (!safeItems.length) return null;

  const active = safeItems[activeIndex];
  const hasMany = safeItems.length > 1;

  const goPrev = () => {
    if (zoomResetTimer.current) {
      clearTimeout(zoomResetTimer.current);
      zoomResetTimer.current = null;
    }
    setIsZoomed(false);
    setZoomOrigin("50% 50%");
    setActiveIndex((prev) => (prev - 1 + safeItems.length) % safeItems.length);
  };

  const goNext = () => {
    if (zoomResetTimer.current) {
      clearTimeout(zoomResetTimer.current);
      zoomResetTimer.current = null;
    }
    setIsZoomed(false);
    setZoomOrigin("50% 50%");
    setActiveIndex((prev) => (prev + 1) % safeItems.length);
  };

  const handleMainImageClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isZoomed) {
      setIsZoomed(false);
      if (zoomResetTimer.current) {
        clearTimeout(zoomResetTimer.current);
      }
      zoomResetTimer.current = setTimeout(() => {
        setZoomOrigin("50% 50%");
        zoomResetTimer.current = null;
      }, 220);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const rawX = ((event.clientX - rect.left) / rect.width) * 100;
    const rawY = ((event.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.min(78, Math.max(22, rawX));
    const clampedY = Math.min(78, Math.max(22, rawY));

    setZoomOrigin(`${clampedX}% ${clampedY}%`);
    setIsZoomed(true);
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
          className={`foto-detail-main-button ${isZoomed ? "is-zoomed" : ""}`}
          onClick={handleMainImageClick}
          aria-label={isZoomed ? "Zoom out" : "Zoom in"}
        >
          <img
            src={active.src}
            alt={active.displayTitle || active.title}
            className={`foto-detail-main-image ${isZoomed ? "is-zoomed" : ""}`}
            style={{ transformOrigin: zoomOrigin }}
          />
          {active.aiMode ? <AiBadge mode={active.aiMode} /> : null}
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
              onClick={() => {
                if (zoomResetTimer.current) {
                  clearTimeout(zoomResetTimer.current);
                  zoomResetTimer.current = null;
                }
                setIsZoomed(false);
                setZoomOrigin("50% 50%");
                setActiveIndex(index);
              }}
            >
              <img
                src={item.thumb}
                alt={item.displayTitle || item.title}
                className="foto-detail-thumb-image"
              />
              {item.aiMode ? <AiBadge mode={item.aiMode} /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
