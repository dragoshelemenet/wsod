type PublicCardProps = {
  title: string;
  subtitle?: string;
  href?: string;
  imageUrl?: string | null;
  imageOnly?: boolean;
};

export function PublicCard({
  title,
  subtitle,
  href,
  imageUrl,
  imageOnly = false,
}: PublicCardProps) {
  const media = imageUrl ? (
    <img src={imageUrl} alt={title} className="public-card-media" />
  ) : (
    <div className="public-card-media" />
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
