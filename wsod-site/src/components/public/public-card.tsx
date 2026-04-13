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
