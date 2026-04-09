import OwnerFolderCard from "@/components/media/OwnerFolderCard";

interface FolderOwnerItem {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  subtitle?: string;
  href: string;
}

interface OwnerFolderGridProps {
  title: string;
  items: FolderOwnerItem[];
  emptyText?: string;
}

export default function OwnerFolderGrid({
  title,
  items,
  emptyText = "Nu există elemente momentan.",
}: OwnerFolderGridProps) {
  return (
    <section className="owner-folder-section">
      <div className="owner-folder-section-head">
        <h2>{title}</h2>
      </div>

      {!items.length ? (
        <p className="empty-state">{emptyText}</p>
      ) : (
        <div className="owner-folder-grid">
          {items.map((item) => (
            <OwnerFolderCard
              key={item.id}
              title={item.name}
              href={item.href}
              subtitle={item.subtitle}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      )}
    </section>
  );
}
