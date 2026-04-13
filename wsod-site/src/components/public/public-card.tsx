type PublicCardProps = {
  title: string;
  subtitle?: string;
  href?: string;
  imageUrl?: string | null;
  imageOnly?: boolean;
  showPlayIcon?: boolean;
};

export function PublicCard({
  title,
  subtitle,
  href,
  imageUrl,
  imageOnly = false,
  showPlayIcon = false,
}: PublicCardProps) {
  const media = imageUrl ? (
    <div className="public-card-media-wrap">
      <img src={imageUrl} alt={title} className="public-card-media" />
      {showPlayIcon ? (
        <div className="public-card-play-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="public-card-play-icon">
            <path d="M8 6.5v11l9-5.5-9-5.5Z" fill="currentColor" />
          </svg>
        </div>
      ) : null}
    </div>
  ) : (
    <div className="public-card-media-wrap">
      <div className="public-card-media" />
      {showPlayIcon ? (
        <div className="public-card-play-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="public-card-play-icon">
            <path d="M8 6.5v11l9-5.5-9-5.5Z" fill="currentColor" />
          </svg>
        </div>
      ) : null}
    </div>
  );

  const content = imageOnly ? (
    media
  ) : (
    <>
      {media}
      <div className="public-card-copy">
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} className={imageOnly ? "public-card image-only-card" : "public-card"}>
        {content}
      </a>
    );
  }

  return (
    <article className={imageOnly ? "public-card image-only-card" : "public-card"}>
      {content}
    </article>
  );
}
