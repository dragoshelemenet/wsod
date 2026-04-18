"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type GalleryItem = {
  id: string;
  title: string;
  displayTitle?: string;
  slug?: string;
  src: string;
  thumb: string;
  aiMode?: string;
  beforeAiSrc?: string;
};

type Props = {
  items: GalleryItem[];
  titleTargetId?: string;
};

function AiBadge({ mode }: { mode?: string }) {
  const isFullAi = mode === "ai";
  const isEnhanced = mode === "ai-enhanced";
  const title = isFullAi
    ? "Fotosesiune complet creată cu AI."
    : isEnhanced
      ? "Îmbunătățit cu inteligență artificială."
      : "Elemente ale imaginii au fost editate cu AI.";
  const label = isFullAi ? "AI" : "AI EDIT";

  return (
    <div className="ai-photo-badge" data-ai-tooltip={title}>
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

const ZOOM_LEVELS = [1, 1.45, 1.9, 2.35];
const MAX_PAN_X = 260;
const MAX_PAN_Y = 220;

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
  const [zoomStep, setZoomStep] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const [showBeforeAi, setShowBeforeAi] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const zoomResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragState = useRef<{
    startX: number;
    startY: number;
    startPanX: number;
    startPanY: number;
  } | null>(null);

  const clampPan = (x: number, y: number) => ({
    x: Math.max(-MAX_PAN_X, Math.min(MAX_PAN_X, x)),
    y: Math.max(-MAX_PAN_Y, Math.min(MAX_PAN_Y, y)),
  });

  const resetZoomState = () => {
    if (zoomResetTimer.current) {
      clearTimeout(zoomResetTimer.current);
      zoomResetTimer.current = null;
    }
    dragState.current = null;
    setZoomStep(0);
    setPan({ x: 0, y: 0 });
    setZoomOrigin("50% 50%");
  };

  useEffect(() => {
    resetZoomState();
    setActiveIndex(initialIndex);
    setShowBeforeAi(false);
  }, [initialIndex]);

  useEffect(() => {
    return () => {
      if (zoomResetTimer.current) {
        clearTimeout(zoomResetTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!dragState.current || zoomStep === 0) return;

      const nextX = dragState.current.startPanX + (event.clientX - dragState.current.startX);
      const nextY = dragState.current.startPanY + (event.clientY - dragState.current.startY);
      setPan(clampPan(nextX, nextY));
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!dragState.current || zoomStep === 0 || !event.touches[0]) return;

      const touch = event.touches[0];
      const nextX = dragState.current.startPanX + (touch.clientX - dragState.current.startX);
      const nextY = dragState.current.startPanY + (touch.clientY - dragState.current.startY);
      setPan(clampPan(nextX, nextY));
    };

    const stopDragging = () => {
      dragState.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", stopDragging);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [zoomStep]);

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
  const canToggleBeforeAi = Boolean(active?.beforeAiSrc);
  const activeImageSrc = showBeforeAi && active?.beforeAiSrc ? active.beforeAiSrc : active?.src;

  const goPrev = () => {
    resetZoomState();
    setShowBeforeAi(false);
    setActiveIndex((prev) => (prev - 1 + safeItems.length) % safeItems.length);
  };

  const goNext = () => {
    resetZoomState();
    setShowBeforeAi(false);
    setActiveIndex((prev) => (prev + 1) % safeItems.length);
  };

  const handleZoomIn = () => {
    if (zoomResetTimer.current) {
      clearTimeout(zoomResetTimer.current);
      zoomResetTimer.current = null;
    }

    setZoomOrigin("50% 50%");
    setZoomStep((current) => Math.min(current + 1, ZOOM_LEVELS.length - 1));
  };

  const handleZoomOut = () => {
    if (zoomResetTimer.current) {
      clearTimeout(zoomResetTimer.current);
      zoomResetTimer.current = null;
    }

    dragState.current = null;
    setZoomStep((current) => {
      const next = Math.max(current - 1, 0);

      if (next === 0) {
        zoomResetTimer.current = setTimeout(() => {
          setPan({ x: 0, y: 0 });
          setZoomOrigin("50% 50%");
          zoomResetTimer.current = null;
        }, 220);
      }

      return next;
    });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (zoomStep === 0) return;

    dragState.current = {
      startX: event.clientX,
      startY: event.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (zoomStep === 0 || !event.touches[0]) return;

    const touch = event.touches[0];
    dragState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
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

        <div
          className={`foto-detail-main-frame ${zoomStep > 0 ? "is-zoomed" : ""}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="foto-detail-zoom-controls">
            {zoomStep > 0 ? (
              <button
                type="button"
                className="foto-detail-zoom-control"
                onClick={handleZoomOut}
                aria-label="Zoom out"
              >
                −
              </button>
            ) : null}

            {zoomStep < ZOOM_LEVELS.length - 1 ? (
              <button
                type="button"
                className="foto-detail-zoom-control"
                onClick={handleZoomIn}
                aria-label="Zoom in"
              >
                +
              </button>
            ) : null}
          </div>

          <div className={`foto-detail-main-button ${zoomStep > 0 ? "is-zoomed" : ""}`}>
            <img
              src={activeImageSrc}
              alt={active.displayTitle || active.title}
              className={`foto-detail-main-image ${zoomStep > 0 ? "is-zoomed" : ""}`}
              style={{
                transformOrigin: zoomOrigin,
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${ZOOM_LEVELS[zoomStep]})`,
              }}
            />
            {active.aiMode ? <AiBadge mode={active.aiMode} /> : null}
          </div>
        </div>

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

      {canToggleBeforeAi ? (
        <div className="foto-before-ai-toggle-wrap">
          <button
            type="button"
            role="switch"
            aria-checked={!showBeforeAi}
            className={`foto-before-ai-toggle ${showBeforeAi ? "is-before" : "is-ai"}`}
            onClick={() => {
              resetZoomState();
              setShowBeforeAi((current) => !current);
            }}
          >
            <span className="foto-before-ai-toggle-label-left">Înainte de AI</span>
            <span className="foto-before-ai-toggle-track">
              <span className="foto-before-ai-toggle-knob" />
            </span>
            <span className="foto-before-ai-toggle-label-right">AI</span>
          </button>
        </div>
      ) : null}

      {hasMany ? (
        <div className="foto-detail-thumb-grid">
          {safeItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`foto-detail-thumb-button ${index === activeIndex ? "is-active" : ""}`}
              onClick={() => {
                resetZoomState();
                setShowBeforeAi(false);
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