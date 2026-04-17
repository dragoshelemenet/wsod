type OwnerFolderCardProps = {
  title: string;
  href?: string;
  imageUrl?: string | null;
  variant?: "default" | "brand" | "model";
};

export function OwnerFolderCard({
  title,
  href,
  imageUrl,
  variant = "default",
}: OwnerFolderCardProps) {
  const cardClassName =
    variant === "brand"
      ? "public-owner-folder-card is-brand-mini"
      : variant === "model"
        ? "public-owner-folder-card is-model-tall"
        : "public-owner-folder-card";

  const artClassName =
    variant === "brand"
      ? "public-owner-folder-art is-brand-art"
      : variant === "model"
        ? "public-owner-folder-art is-model-art"
        : "public-owner-folder-art";

  const imageClassName =
    variant === "brand"
      ? "public-owner-folder-image is-brand-image"
      : variant === "model"
        ? "public-owner-folder-image is-model-image"
        : "public-owner-folder-image";

  const content = (
    <>
      <div className="public-owner-folder-tab" />
      <div className={artClassName}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className={imageClassName}
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
      <a href={href} className={cardClassName}>
        {content}
      </a>
    );
  }

  return <div className={cardClassName}>{content}</div>;
}
