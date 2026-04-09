import Link from "next/link";
import { getCategoryLabel } from "@/lib/data/home-data";
import { DbMediaCardItem } from "@/lib/types";

interface MediaCardProps {
  item: DbMediaCardItem;
}

export default function MediaCard({ item }: MediaCardProps) {
  const owner = item.owner;
  const ownerHref =
    owner.type === "brand" && owner.slug
      ? `/brand/${owner.slug}`
      : owner.type === "model" && owner.slug
        ? `/model/${owner.slug}`
        : owner.type === "audioProfile" && owner.slug
          ? `/audio-profile/${owner.slug}`
          : null;

  const previewSrc = item.thumbnailUrl || item.previewUrl || item.fileUrl || null;

  return (
    <article className="media-card media-card-compact">
      <div className="media-thumb">
        <div className="media-thumb-inner">
          {previewSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewSrc}
              alt={item.title}
              className="media-thumb-image"
              loading="lazy"
            />
          ) : (
            <div className="media-thumb-fallback">{item.type.toUpperCase()}</div>
          )}
        </div>
      </div>

      <div className="media-copy">
        <div className="media-topline">
          <span className="brand-chip">{owner.type === "unknown" ? "Media" : owner.name}</span>
          <span className="media-date">
            {new Date(item.date).toLocaleDateString("ro-RO")}
          </span>
        </div>

        <h3 className="media-title">{item.title}</h3>

        <div className="media-meta">
          <span>{getCategoryLabel(item.category)}</span>
          {item.fileNameOriginal ? <span>{item.fileNameOriginal}</span> : null}
        </div>

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
              Deschide
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
