"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

interface OwnerFolderCardProps {
  title: string;
  href: string;
  subtitle?: string;
  imageUrl?: string | null;
  previewImages?: string[];
  compact?: boolean;
}

function isTransparentFriendlyAsset(url?: string | null) {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return clean.endsWith(".png") || clean.endsWith(".webp");
}

function isVideoUrl(url?: string | null) {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return [".mp4", ".webm", ".mov", ".m4v", ".ogg"].some((ext) =>
    clean.endsWith(ext)
  );
}

function getOwnerTypeFromHref(href: string) {
  if (href.includes("/brand/")) return "brand";
  if (href.includes("/model/")) return "model";
  if (href.includes("/audio-profile/")) return "audio";
  return "unknown";
}

function PreviewMedia({
  src,
  className,
  onError,
}: {
  src: string;
  className: string;
  onError: () => void;
}) {
  if (isVideoUrl(src)) {
    return (
      <video
        src={src}
        className={className}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={onError}
      />
    );
  }

  return (
    <img
      src={src}
      alt=""
      className={className}
      loading="lazy"
      onError={onError}
    />
  );
}

export default function OwnerFolderCard({
  title,
  href,
  imageUrl,
  previewImages = [],
}: OwnerFolderCardProps) {
  const ownerType = getOwnerTypeFromHref(href);
  const [failed, setFailed] = useState<string[]>([]);

  const cleanPreviewImages = useMemo(() => {
    return [...new Set(previewImages.filter(Boolean))].filter((src) => !failed.includes(src));
  }, [previewImages, failed]);

  const mainImage = imageUrl && !failed.includes(imageUrl) ? imageUrl : cleanPreviewImages[0] ?? null;
  const hoverImages = cleanPreviewImages.filter((src) => src !== mainImage).slice(0, 3);

  const useTransparentArt = isTransparentFriendlyAsset(imageUrl);
  const isBrand = ownerType === "brand";
  const isModel = ownerType === "model";

  return (
    <Link
      href={href}
      className={`owner-folder-card folder-card folder-card-rich owner-folder-card-${ownerType}`}
    >
      <div className="folder-top" />

      <div className="folder-body owner-folder-classic-body">
        {isModel ? (
          <div className="folder-model-title-wrap" aria-hidden="true">
            <span className="folder-model-title">{title}</span>
          </div>
        ) : mainImage ? (
          <div
            className={`folder-brand-art-wrap${useTransparentArt ? " folder-brand-art-wrap-transparent" : ""}`}
            aria-hidden="true"
          >
            <PreviewMedia
              src={mainImage}
              className={`folder-brand-art${useTransparentArt ? " folder-brand-art-transparent" : ""}`}
              onError={() => setFailed((current) => [...current, mainImage])}
            />
          </div>
        ) : (
          <span>{title}</span>
        )}

        {hoverImages.length ? (
          <div className="folder-hover-preview" aria-hidden="true">
            {hoverImages[0] ? (
              <div className="folder-hover-shot folder-hover-shot-1">
                <PreviewMedia
                  src={hoverImages[0]}
                  className="folder-hover-media"
                  onError={() => setFailed((current) => [...current, hoverImages[0]])}
                />
              </div>
            ) : null}

            {hoverImages[1] ? (
              <div className="folder-hover-shot folder-hover-shot-2">
                <PreviewMedia
                  src={hoverImages[1]}
                  className="folder-hover-media"
                  onError={() => setFailed((current) => [...current, hoverImages[1]])}
                />
              </div>
            ) : null}

            {hoverImages[2] ? (
              <div className="folder-hover-shot folder-hover-shot-3">
                <PreviewMedia
                  src={hoverImages[2]}
                  className="folder-hover-media"
                  onError={() => setFailed((current) => [...current, hoverImages[2]])}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {isBrand ? null : (
        <div className="owner-folder-copy">
          <strong>{title}</strong>
        </div>
      )}
    </Link>
  );
}
