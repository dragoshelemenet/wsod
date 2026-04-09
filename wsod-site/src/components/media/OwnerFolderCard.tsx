import Link from "next/link";

interface OwnerFolderCardProps {
  title: string;
  href: string;
  subtitle?: string;
  imageUrl?: string | null;
}

export default function OwnerFolderCard({
  title,
  href,
  subtitle,
  imageUrl,
}: OwnerFolderCardProps) {
  return (
    <Link href={href} className="owner-folder-card">
      <div className="owner-folder-visual">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={title} className="owner-folder-image" />
        ) : (
          <div className="owner-folder-placeholder">Folder</div>
        )}
      </div>

      <div className="owner-folder-copy">
        <strong>{title}</strong>
        {subtitle ? <span>{subtitle}</span> : null}
      </div>
    </Link>
  );
}
