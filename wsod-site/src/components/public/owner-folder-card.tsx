type OwnerFolderCardProps = {
  title: string;
  href?: string;
  imageUrl?: string | null;
};

export function OwnerFolderCard({ title, href, imageUrl }: OwnerFolderCardProps) {
  const content = (
    <>
      <div className="public-owner-folder-tab" />
      <div className="public-owner-folder-art">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="public-owner-folder-image"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="public-owner-folder-placeholder" />
        )}
      </div>
      <div className="public-owner-folder-title">{title}</div>
    </>
  );

  if (href) {
    return (
      <a href={href} className="public-owner-folder-card">
        {content}
      </a>
    );
  }

  return <div className="public-owner-folder-card">{content}</div>;
}
