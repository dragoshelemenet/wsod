type MediaFileCardProps = {
  title: string;
  category: string;
  href?: string;
  imageUrl?: string | null;
};

export function MediaFileCard({
  title,
  category,
  href,
  imageUrl,
}: MediaFileCardProps) {
  const content = (
    <>
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="media-file-card-thumb" />
      ) : (
        <div className="media-file-card-thumb" />
      )}
      <div className="media-file-card-meta">
        <strong>{title}</strong>
        <span>{category}</span>
      </div>
    </>
  );

  if (href) {
    return (
      <a href={href} className="media-file-card">
        {content}
      </a>
    );
  }

  return <article className="media-file-card">{content}</article>;
}
