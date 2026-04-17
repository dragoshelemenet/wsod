import Link from "next/link";

type PublicCardProps = {
  title: string;
  href: string;
  imageUrl?: string | null;
  subtitle?: string;
  imageOnly?: boolean;
  showPlayIcon?: boolean;
  imageFit?: "cover" | "contain";
  mediaRatio?: "portrait" | "wide" | "square";
  badgeLabel?: string;
  badgeTooltip?: string;
};

export function PublicCard({
  title,
  href,
  imageUrl,
  subtitle,
  imageOnly = false,
  showPlayIcon = false,
  imageFit = "cover",
  mediaRatio = "portrait",
  badgeLabel,
  badgeTooltip,
}: PublicCardProps) {
  const wrapClass = [
    "public-card-media-wrap",
    mediaRatio === "wide" ? "is-wide" : "",
    mediaRatio === "square" ? "is-square" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const mediaClass = [
    "public-card-media",
    imageFit === "contain" ? "is-contain" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const media = imageUrl ? (
    <div className={wrapClass}>
      <img src={imageUrl} alt={title} className={mediaClass} />
      {showPlayIcon ? <span className="public-card-play">▶</span> : null}
      {badgeLabel ? (
        <span className="ai-photo-badge public-card-ai-badge" data-ai-tooltip={badgeTooltip}>
          <span className="ai-photo-badge-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="ai-photo-badge-icon-svg">
              <path d="M12 3l1.9 4.6L18.5 9l-4.6 1.4L12 15l-1.9-4.6L5.5 9l4.6-1.4L12 3z" fill="currentColor" />
            </svg>
          </span>
          <span className="ai-photo-badge-text">{badgeLabel}</span>
        </span>
      ) : null}
    </div>
  ) : (
    <div className={`${wrapClass} public-card-media-empty`}>
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
