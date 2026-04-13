type BrandFolderCardProps = {
  title: string;
  href?: string;
  imageUrl?: string | null;
};

export function BrandFolderCard({ title, href, imageUrl }: BrandFolderCardProps) {
  const content = (
    <>
      <div className="folder-top" />
      <div className="folder-body">
        <span>{title}</span>
      </div>

      {imageUrl ? (
        <div className="folder-hover-preview" aria-hidden="true">
          <div className="folder-hover-shot folder-hover-shot-1">
            <img
              src={imageUrl}
              alt=""
              loading="lazy"
              decoding="async"
              className="folder-hover-media"
            />
          </div>
        </div>
      ) : null}
    </>
  );

  if (href) {
    return (
      <a href={href} className="folder-card folder-card-rich">
        {content}
      </a>
    );
  }

  return <div className="folder-card folder-card-rich">{content}</div>;
}
