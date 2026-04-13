type FolderFileCardProps = {
  title: string;
  kind: "brand" | "model";
  href?: string;
  imageUrl?: string | null;
};

export function FolderFileCard({
  title,
  kind,
  href,
  imageUrl,
}: FolderFileCardProps) {
  const content = (
    <>
      <article className="owner-folder-card">
        <div className="owner-folder-classic-body">
          <div className="folder-brand-art-wrap">
            {imageUrl ? (
              <img src={imageUrl} alt={title} className="folder-brand-art" />
            ) : (
              <div className="media-file-card-thumb" />
            )}
          </div>
        </div>
      </article>

      <div className="media-file-card-meta">
        <strong>{title}</strong>
        <span>{kind}</span>
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

  return <div className="media-file-card">{content}</div>;
}
