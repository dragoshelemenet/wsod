import Link from "next/link";

type PublicCardProps = {
  title: string;
  href: string;
  imageUrl?: string | null;
  subtitle?: string;
  imageOnly?: boolean;
  showPlayIcon?: boolean;
};

export function PublicCard({
  title,
  href,
  imageUrl,
  subtitle,
  imageOnly = false,
  showPlayIcon = false,
}: PublicCardProps) {
  const media = imageUrl ? (
    <div className="public-card-media-wrap">
      <img src={imageUrl} alt={title} className="public-card-media" />
      {showPlayIcon ? <span className="public-card-play">▶</span> : null}
    </div>
  ) : (
    <div className="public-card-media-wrap public-card-media-empty">
      <span>{title}</span>
    </div>
  );

  if (imageOnly) {
    return (
      <Link href={href} className="public-card public-card-image-only">
        {media}
      </Link>
    );
  }

  return (
    <Link href={href} className="public-card">
      {media}
      <div className="public-card-body">
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </Link>
  );
}
