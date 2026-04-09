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

export default function OwnerFolderCard({
  title,
  href,
  imageUrl,
  previewImages = [],
  compact = false,
}: OwnerFolderCardProps) {
  const imageCandidates = useMemo(() => {
    const unique = [...previewImages.filter(Boolean)];
    if (imageUrl && !unique.includes(imageUrl)) unique.unshift(imageUrl);
    return unique.slice(0, 3);
  }, [imageUrl, previewImages]);

  const [failed, setFailed] = useState<string[]>([]);
  const visibleImages = imageCandidates.filter((src) => !failed.includes(src)).slice(0, 3);

  return (
    <Link
      href={href}
      className={`owner-folder-card${compact ? " owner-folder-card-compact" : ""}`}
    >
      <div className="owner-folder-visual">
        {visibleImages.length ? (
          <div className="owner-folder-collage" aria-hidden="true">
            <div className="owner-folder-collage-main">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={visibleImages[0]}
                alt=""
                className="owner-folder-image owner-folder-image-main"
                loading="lazy"
                onError={() => setFailed((current) => [...current, visibleImages[0]])}
              />
            </div>

            <div className="owner-folder-collage-side">
              {visibleImages[1] ? (
                <div className="owner-folder-collage-small">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={visibleImages[1]}
                    alt=""
                    className="owner-folder-image"
                    loading="lazy"
                    onError={() => setFailed((current) => [...current, visibleImages[1]])}
                  />
                </div>
              ) : null}

              {visibleImages[2] ? (
                <div className="owner-folder-collage-small">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={visibleImages[2]}
                    alt=""
                    className="owner-folder-image"
                    loading="lazy"
                    onError={() => setFailed((current) => [...current, visibleImages[2]])}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="owner-folder-placeholder">Folder</div>
        )}
      </div>

      <div className="owner-folder-copy">
        <strong>{title}</strong>
      </div>
    </Link>
  );
}
