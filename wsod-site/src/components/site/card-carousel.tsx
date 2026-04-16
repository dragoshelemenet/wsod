"use client";

import Link from "next/link";
import { useRef } from "react";

type CarouselItem = {
  href: string;
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
};

type CardCarouselProps = {
  title: string;
  items: CarouselItem[];
};

export function CardCarousel({ title, items }: CardCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  function scrollByAmount(amount: number) {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  }

  if (!items.length) return null;

  return (
    <section style={{ marginTop: 40 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <h2 style={{ fontSize: 24, margin: 0 }}>{title}</h2>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => scrollByAmount(-360)}
            style={{
              border: "1px solid rgba(255,255,255,0.16)",
              background: "transparent",
              color: "white",
              padding: "8px 14px",
              cursor: "pointer",
            }}
          >
            {"<"}
          </button>

          <button
            type="button"
            onClick={() => scrollByAmount(360)}
            style={{
              border: "1px solid rgba(255,255,255,0.16)",
              background: "transparent",
              color: "white",
              padding: "8px 14px",
              cursor: "pointer",
            }}
          >
            {">"}
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          scrollBehavior: "smooth",
          paddingBottom: 8,
        }}
      >
        {items.map((item) => (
          <Link
            key={`${item.href}-${item.title}`}
            href={item.href}
            style={{
              minWidth: 280,
              maxWidth: 280,
              textDecoration: "none",
              color: "inherit",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)",
              display: "block",
            }}
          >
            <div
              style={{
                aspectRatio: "4 / 3",
                background: "#111",
                overflow: "hidden",
              }}
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 14,
                  }}
                >
                  no image
                </div>
              )}
            </div>

            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
                {item.title}
              </div>
              {item.subtitle ? (
                <div style={{ fontSize: 13, opacity: 0.72 }}>{item.subtitle}</div>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
