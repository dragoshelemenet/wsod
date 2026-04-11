"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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

function PreviewMedia({
  src,
  className,
  onError,
  alt,
  eager = false,
}: {
  src: string;
  className: string;
  onError: () => void;
  alt: string;
  eager?: boolean;
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
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes="(max-width: 768px) 140px, 180px"
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
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
  const [failed, setFailed] = useState<string[]>([]);

  const cleanPreviewImages = useMemo(() => {
    return [...new Set(previewImages.filter(Boolean))].filter((src) => !failed.includes(src));
  }, [previewImages, failed]);

  const mainImage =
    imageUrl && !failed.includes(imageUrl) ? imageUrl : cleanPreviewImages[0] ?? null;

  const hoverImages = cleanPreviewImages.filter((src) => src !== mainImage).slice(0, 3);
  const useTransparentArt = isTransparentFriendlyAsset(imageUrl);

  return (
    <Link href={href} className="owner-folder-card folder-card folder-card-rich owner-folder-card-unified">
      <div className="folder-top" />

      <div className="folder-body owner-folder-classic-body">
        {mainImage ? (
          <div
            className={`folder-brand-art-wrap${useTransparentArt ? " folder-brand-art-wrap-transparent" : ""}`}
            aria-hidden="true"
          >
            <PreviewMedia
              src={mainImage}
              alt={title}
              eager={false}
              className={`folder-brand-art${useTransparentArt ? " folder-brand-art-transparent" : ""}`}
              onError={() => setFailed((current) => [...current, mainImage])}
            />
          </div>
        ) : (
          <div className="folder-model-title-wrap" aria-hidden="true">
            <span className="folder-model-title">{title}</span>
          </div>
        )}

        {hoverImages.length ? (
          <div className="folder-hover-preview" aria-hidden="true">
            {hoverImages[0] ? (
              <div className="folder-hover-shot folder-hover-shot-1">
                <PreviewMedia
                  src={hoverImages[0]}
                  alt={`${title} preview 1`}
                  className="folder-hover-media"
                  onError={() => setFailed((current) => [...current, hoverImages[0]])}
                />
              </div>
            ) : null}

            {hoverImages[1] ? (
              <div className="folder-hover-shot folder-hover-shot-2">
                <PreviewMedia
                  src={hoverImages[1]}
                  alt={`${title} preview 2`}
                  className="folder-hover-media"
                  onError={() => setFailed((current) => [...current, hoverImages[1]])}
                />
              </div>
            ) : null}

            {hoverImages[2] ? (
              <div className="folder-hover-shot folder-hover-shot-3">
                <PreviewMedia
                  src={hoverImages[2]}
                  alt={`${title} preview 3`}
                  className="folder-hover-media"
                  onError={() => setFailed((current) => [...current, hoverImages[2]])}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
