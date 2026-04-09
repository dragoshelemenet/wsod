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
  subtitle,
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

  const visibleImages = imageCandidates.filter((src) => !failed.includes(src));

  return (
    <Link
      href={href}
      className={`owner-folder-card${compact ? " owner-folder-card-compact" : ""}`}
    >
      <div className="owner-folder-visual">
        {visibleImages.length ? (
          <div className="owner-folder-stack" aria-hidden="true">
            {visibleImages.slice(0, 3).map((src, index) => (
              <div
                key={`${src}-${index}`}
                className={`owner-folder-stack-item owner-folder-stack-item-${index + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="owner-folder-image"
                  loading="lazy"
                  onError={() => setFailed((current) => [...current, src])}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="owner-folder-placeholder">Folder</div>
        )}
      </div>

      <div className="owner-folder-copy">
        <strong>{title}</strong>
        {!compact && subtitle ? <span>{subtitle}</span> : null}
      </div>
    </Link>
  );
}
