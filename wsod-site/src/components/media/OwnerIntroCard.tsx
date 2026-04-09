interface OwnerIntroCardProps {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  metaLine?: string;
}

export default function OwnerIntroCard({
  title,
  description,
  imageUrl,
  metaLine,
}: OwnerIntroCardProps) {
  return (
    <div className="owner-intro-card">
      {imageUrl ? (
        <div className="owner-intro-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={title} className="owner-intro-image" />
        </div>
      ) : null}

      <div className="owner-intro-copy">
        <h1>{title}</h1>
        {metaLine ? <p className="owner-intro-meta">{metaLine}</p> : null}
        {description ? <p className="inner-description">{description}</p> : null}
      </div>
    </div>
  );
}
