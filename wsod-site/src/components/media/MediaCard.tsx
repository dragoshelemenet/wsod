import Link from "next/link";
import { getBrandNameBySlug, getCategoryLabel } from "@/lib/data/home-data";
import { MediaItem } from "@/lib/types";

interface MediaCardProps {
  item: MediaItem;
}

export default function MediaCard({ item }: MediaCardProps) {
  return (
    <article className="media-card">
      <div className="media-thumb">
        <div className="media-thumb-inner">{item.type.toUpperCase()}</div>
      </div>

      <div className="media-copy">
        <h3>{item.title}</h3>
        <p>{item.description}</p>

        <div className="media-meta">
          <span>{getCategoryLabel(item.category)}</span>
          <span>{new Date(item.date).toLocaleDateString("ro-RO")}</span>
        </div>

        <div className="media-brand-row">
          <span className="brand-chip">
            Brand: {getBrandNameBySlug(item.brandSlug)}
          </span>

          <Link href={`/brand/${item.brandSlug}`} className="media-link">
            Vezi brandul
          </Link>
        </div>
      </div>
    </article>
  );
}