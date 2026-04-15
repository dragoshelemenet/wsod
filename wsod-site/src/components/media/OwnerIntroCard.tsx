interface OwnerIntroCardProps {
  title: string;
  href?: string;
  description?: string | null;
  imageUrl?: string | null;
  metaLine?: string;
  imageFit?: "cover" | "contain";
}

export default function OwnerIntroCard({
  title,
  description,
  imageUrl,
  metaLine,
  imageFit = "cover",
}: OwnerIntroCardProps) {
  return (
    <div className="owner-intro-card owner-intro-card-inner">
      {imageUrl ? (
        <div
          className={`owner-intro-visual${
            imageFit === "contain" ? " owner-intro-visual-contain" : ""
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            className={`owner-intro-image${
              imageFit === "contain" ? " owner-intro-image-contain" : ""
            }`}
          />
        </div>
      ) : null}

      <div className="owner-intro-copy">
        {metaLine ? <p className="owner-intro-meta">{metaLine}</p> : null}
        <h1>{title}</h1>
        {description ? <p className="inner-description">{description}</p> : null}
      </div>
    </div>
  );
}
