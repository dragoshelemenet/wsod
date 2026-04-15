type FolderFileCardProps = {
  title: string;
  kind: "brand" | "model";
  href?: string;
  imageUrl?: string | null;
  imageOnly?: boolean;
};

export function FolderFileCard({
  title,
  kind,
  href,
  imageUrl,
  imageOnly = false,
}: FolderFileCardProps) {
  const media = imageUrl ? (
    <img src={imageUrl} alt={title} className="folder-brand-art" />
  ) : (
    <div className="media-file-card-thumb" />
  );

  const content = imageOnly ? (
    <div className="folder-brand-art-wrap">{media}</div>
  ) : (
    <>
      <article className="owner-folder-card">
        <div className="owner-folder-classic-body">
          <div className="folder-brand-art-wrap">{media}</div>
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
      <a href={href} className={imageOnly ? "media-file-card image-only-card" : "media-file-card"}>
        {content}
      </a>
    );
  }

  return (
    <div className={imageOnly ? "media-file-card image-only-card" : "media-file-card"}>
      {content}
    </div>
  );
}
