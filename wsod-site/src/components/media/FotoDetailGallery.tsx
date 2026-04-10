"use client";

import Link from "next/link";
import { useMemo } from "react";
import { DbMediaCardItem } from "@/lib/types";

interface FotoDetailGalleryProps {
  currentItem: DbMediaCardItem;
  galleryItems: DbMediaCardItem[];
  ownerHref: string | null;
  backHref?: string;
}

function getImageSrc(item: DbMediaCardItem) {
  return item.fileUrl || item.previewUrl || item.thumbnailUrl || null;
}

function getOwnerLabel(item: DbMediaCardItem) {
  if (item.owner.type === "model") return `Poze cu ${item.owner.name}`;
  if (item.owner.type === "brand") return `Poze pentru ${item.owner.name}`;
  if (item.owner.type === "audioProfile") return `Poze pentru ${item.owner.name}`;
  return "Galerie foto";
}

export default function FotoDetailGallery({
  currentItem,
  galleryItems,
  ownerHref,
  backHref = "/foto",
}: FotoDetailGalleryProps) {
  const orderedItems = useMemo(() => {
    const map = new Map<string, DbMediaCardItem>();
    for (const item of galleryItems) {
      if (item.category === "foto") {
        map.set(item.id, item);
      }
    }
    map.set(currentItem.id, currentItem);
    return Array.from(map.values());
  }, [galleryItems, currentItem]);

  const currentIndex = Math.max(
    0,
    orderedItems.findIndex((item) => item.id === currentItem.id)
  );

  const prevItem =
    orderedItems.length > 1
      ? orderedItems[(currentIndex - 1 + orderedItems.length) % orderedItems.length]
      : null;

  const nextItem =
    orderedItems.length > 1
      ? orderedItems[(currentIndex + 1) % orderedItems.length]
      : null;

  const imageSrc = getImageSrc(currentItem);

  return (
    <div className="foto-gallery-shell">
      <div className="foto-gallery-topbar">
        <Link href={backHref} className="back-link">
          ← Înapoi
        </Link>

        <div className="foto-gallery-counter">
          {orderedItems.length ? `${currentIndex + 1} / ${orderedItems.length}` : "1 / 1"}
        </div>

        <div className="foto-gallery-nav">
          {prevItem ? (
            <Link
              href={`/foto/${prevItem.slug}`}
              className="foto-gallery-arrow"
              aria-label="Poza precedentă"
            >
              ‹
            </Link>
          ) : null}

          {nextItem ? (
            <Link
              href={`/foto/${nextItem.slug}`}
              className="foto-gallery-arrow"
              aria-label="Poza următoare"
            >
              ›
            </Link>
          ) : null}
        </div>
      </div>

      <div className="foto-gallery-stage">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={currentItem.title}
            className="foto-gallery-main-image"
          />
        ) : (
          <div className="foto-gallery-empty">PHOTO</div>
        )}
      </div>

      <div className="foto-gallery-meta">
        <div>
          <h1>{currentItem.title}</h1>
          <p>{getOwnerLabel(currentItem)}</p>
        </div>

        <div className="foto-gallery-meta-actions">
          {ownerHref ? (
            <Link href={ownerHref} className="media-link">
              Vezi owner
            </Link>
          ) : null}

          {currentItem.fileUrl ? (
            <a
              href={currentItem.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="media-open-button"
            >
              Deschide originalul
            </a>
          ) : null}
        </div>
      </div>

      {orderedItems.length > 1 ? (
        <div className="foto-gallery-strip">
          {orderedItems.map((item) => {
            const thumbSrc = getImageSrc(item);

            return (
              <Link
                key={item.id}
                href={`/foto/${item.slug}`}
                className={`foto-gallery-thumb ${item.id === currentItem.id ? "is-active" : ""}`}
                aria-label={`Deschide ${item.title}`}
              >
                {thumbSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumbSrc} alt={item.title} className="foto-gallery-thumb-image" />
                ) : (
                  <div className="foto-gallery-thumb-fallback">PHOTO</div>
                )}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
