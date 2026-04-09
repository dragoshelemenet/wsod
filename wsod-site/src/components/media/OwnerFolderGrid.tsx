import OwnerFolderCard from "@/components/media/OwnerFolderCard";

interface FolderOwnerItem {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  previewImages?: string[];
  subtitle?: string;
  href: string;
}

interface OwnerFolderGridProps {
  title: string;
  items: FolderOwnerItem[];
  emptyText?: string;
  variant?: "default" | "compact-file";
}

export default function OwnerFolderGrid({
  title,
  items,
  emptyText = "Nu există elemente momentan.",
  variant = "default",
}: OwnerFolderGridProps) {
  const isCompact = variant === "compact-file";

  return (
    <section className="owner-folder-section">
      <div className="owner-folder-section-head">
        <h2>{title}</h2>
      </div>

      {!items.length ? (
        <p className="empty-state">{emptyText}</p>
      ) : (
        <div
          className={`owner-folder-grid${
            isCompact ? " owner-folder-grid-compact" : ""
          }`}
        >
          {items.map((item) => (
            <OwnerFolderCard
              key={item.id}
              title={item.name}
              href={item.href}
              subtitle={item.subtitle}
              imageUrl={item.imageUrl}
              previewImages={item.previewImages}
              compact={isCompact}
            />
          ))}
        </div>
      )}
    </section>
  );
}
