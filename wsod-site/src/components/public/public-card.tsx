type PublicCardProps = {
  title: string;
  subtitle?: string;
  href?: string;
  imageUrl?: string | null;
};

export function PublicCard({
  title,
  subtitle,
  href,
  imageUrl,
}: PublicCardProps) {
  const media = imageUrl ? (
    <img src={imageUrl} alt={title} className="public-card-media" />
  ) : (
    <div className="public-card-media" />
  );

  const content = (
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
      <a href={href} className="public-card">
        {content}
      </a>
    );
  }

  return <article className="public-card">{content}</article>;
}
