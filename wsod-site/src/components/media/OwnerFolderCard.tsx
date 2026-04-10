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

export default function OwnerFolderCard({
  title,
  href,
  imageUrl,
  previewImages = [],
}: OwnerFolderCardProps) {
  const imageCandidates = useMemo(() => {
    const unique = [...previewImages.filter(Boolean)];
    if (imageUrl && !unique.includes(imageUrl)) {
      unique.unshift(imageUrl);
    }
    return unique.slice(0, 4);
  }, [imageUrl, previewImages]);

  const [failed, setFailed] = useState<string[]>([]);
  const visibleImages = imageCandidates.filter((src) => !failed.includes(src));
  const mainImage = visibleImages[0] ?? null;
  const hoverImages = visibleImages.slice(1, 4);
  const useTransparentArt = isTransparentFriendlyAsset(imageUrl);

  return (
    <Link href={href} className="owner-folder-card folder-card folder-card-rich">
      <div className="folder-top" />

      <div className="folder-body owner-folder-classic-body">
        {mainImage ? (
          <div
            className={`folder-brand-art-wrap${useTransparentArt ? " folder-brand-art-wrap-transparent" : ""}`}
            aria-hidden="true"
          >
            <img
              src={mainImage}
              alt=""
              className={`folder-brand-art${useTransparentArt ? " folder-brand-art-transparent" : ""}`}
              loading="lazy"
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
                <img
                  src={hoverImages[0]}
                  alt=""
                  loading="lazy"
                  onError={() => setFailed((current) => [...current, hoverImages[0]])}
                />
              </div>
            ) : null}

            {hoverImages[1] ? (
              <div className="folder-hover-shot folder-hover-shot-2">
                <img
                  src={hoverImages[1]}
                  alt=""
                  loading="lazy"
                  onError={() => setFailed((current) => [...current, hoverImages[1]])}
                />
              </div>
            ) : null}

            {hoverImages[2] ? (
              <div className="folder-hover-shot folder-hover-shot-3">
                <img
                  src={hoverImages[2]}
                  alt=""
                  loading="lazy"
                  onError={() => setFailed((current) => [...current, hoverImages[2]])}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="owner-folder-copy">
        <strong>{title}</strong>
      </div>
    </Link>
  );
}
