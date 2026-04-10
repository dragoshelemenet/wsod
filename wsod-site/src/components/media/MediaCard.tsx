"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getCategoryLabel } from "@/lib/data/home-data";
import { DbMediaCardItem } from "@/lib/types";

interface MediaCardProps {
  item: DbMediaCardItem;
}

function getItemHref(item: DbMediaCardItem) {
  if (item.category === "foto") return `/foto/${item.slug}`;
  if (item.category === "video") return `/video/${item.slug}`;
  if (item.category === "audio") return `/audio/${item.slug}`;
  if (item.category === "grafica") return `/grafica/${item.slug}`;
  if (item.category === "website") return `/website/${item.slug}`;
  if (item.category === "meta-ads") return `/meta-ads/${item.slug}`;
  return item.fileUrl || "#";
}

function isImageUrl(url?: string | null) {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"].some((ext) =>
    clean.endsWith(ext)
  );
}

export default function MediaCard({ item }: MediaCardProps) {
  const owner = item.owner;
  const isPhotoFile = item.category === "foto";
  const isGraphicFile = item.category === "grafica";
  const isVideoFile = item.category === "video";

  const ownerHref =
    owner.type === "brand" && owner.slug
      ? `/brand/${owner.slug}`
      : owner.type === "model" && owner.slug
        ? `/model/${owner.slug}`
        : owner.type === "audioProfile" && owner.slug
          ? `/audio-profile/${owner.slug}`
          : null;

  const imageCandidates = useMemo(
    () =>
      [item.thumbnailUrl, item.previewUrl, item.fileUrl].filter(
        (url): url is string => Boolean(url) && isImageUrl(url)
      ),
    [item.thumbnailUrl, item.previewUrl, item.fileUrl]
  );

  const [imageIndex, setImageIndex] = useState(0);
  const previewSrc = imageCandidates[imageIndex] ?? null;
  const itemHref = getItemHref(item);

  if (isPhotoFile || isGraphicFile) {
    return (
      <article
        className={`media-card media-card-visual-only ${
          isGraphicFile ? "media-card-graphic-file" : "media-card-photo-file"
        }`}
      >
        <Link
          href={itemHref}
          className="media-card-photo-link"
          aria-label={`Deschide ${item.title}`}
        >
          <div className="media-card-photo-thumb">
            <div className="media-card-photo-thumb-inner">
              {previewSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewSrc}
                  alt={item.title}
                  className="media-card-photo-image"
                  loading="lazy"
                  onError={() => {
                    if (imageIndex < imageCandidates.length - 1) {
                      setImageIndex((current) => current + 1);
                    }
                  }}
                />
              ) : (
                <div className="media-thumb-fallback">
                  {isGraphicFile ? "GRAPHIC" : "PHOTO"}
                </div>
              )}
            </div>
          </div>

          <div className="media-card-photo-caption" />
        </Link>
      </article>
    );
  }

  return (
    <article className="media-card media-card-compact">
      <Link
        href={itemHref}
        className="media-card-main-link"
        aria-label={`Deschide ${item.title}`}
      >
        <div className="media-thumb">
          <div className="media-thumb-inner">
            {previewSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewSrc}
                alt={item.title}
                className="media-thumb-image"
                loading="lazy"
                onError={() => {
                  if (imageIndex < imageCandidates.length - 1) {
                    setImageIndex((current) => current + 1);
                  }
                }}
              />
            ) : isVideoFile && item.fileUrl ? (
              <video
                src={item.fileUrl}
                className="media-thumb-image"
                muted
                playsInline
                preload="metadata"
              />
            ) : (
              <div className="media-thumb-fallback">{item.type.toUpperCase()}</div>
            )}
          </div>
        </div>

        <div className="media-copy">
          <div className="media-topline">
            <span className="brand-chip">
              {owner.type === "unknown" ? "Media" : owner.name}
            </span>
            <span className="media-date">
              {new Date(item.date).toLocaleDateString("ro-RO")}
            </span>
          </div>

          <h3 className="media-title">{item.title}</h3>

          <div className="media-meta">
            <span>{getCategoryLabel(item.category)}</span>
            {item.fileNameOriginal ? <span>{item.fileNameOriginal}</span> : null}
          </div>
        </div>
      </Link>

      <div className="media-actions">
        {ownerHref ? (
          <Link href={ownerHref} className="media-link">
            Vezi {owner.type === "audioProfile" ? "profilul audio" : owner.type}
          </Link>
        ) : null}

        {item.fileUrl ? (
          <a
            href={item.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="media-open-button"
          >
            {isVideoFile ? "Deschide video" : "Deschide originalul"}
          </a>
        ) : null}
      </div>
    </article>
  );
}
