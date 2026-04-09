import Link from "next/link";
import { getCategoryLabel } from "@/lib/data/home-data";
import { DbMediaCardItem } from "@/lib/types";

interface MediaCardProps {
  item: DbMediaCardItem;
}

export default function MediaCard({ item }: MediaCardProps) {
  const ownerLabel = item.personModel ? "Model" : "Brand";
  const ownerName = item.personModel?.name ?? item.brand?.name ?? "Fără asociere";
  const ownerHref = item.personModel
    ? `/model/${item.personModel.slug}`
    : item.brand
      ? `/brand/${item.brand.slug}`
      : null;

  return (
    <article className="media-card">
      <div className="media-thumb">
        <div className="media-thumb-inner">
          {item.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.thumbnail}
              alt={item.title}
              className="media-thumb-image"
            />
          ) : (
            item.type.toUpperCase()
          )}
        </div>
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
            {ownerLabel}: {ownerName}
          </span>

          {ownerHref ? (
            <Link href={ownerHref} className="media-link">
              Vezi {ownerLabel.toLowerCase()}
            </Link>
          ) : null}
        </div>

        {item.fileUrl && (
          <div className="media-actions">
            <a
              href={item.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="media-open-button"
            >
              Deschide fișierul
            </a>
          </div>
        )}
      </div>
    </article>
  );
}