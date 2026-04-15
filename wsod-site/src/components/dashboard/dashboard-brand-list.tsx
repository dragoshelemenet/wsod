import { DashboardDeleteButton } from "@/components/dashboard/dashboard-delete-button";

type DashboardBrandListItem = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  coverImageUrl: string | null;
  description: string | null;
  isVisible: boolean;
  mediaItems?: Array<{
    thumbnailUrl: string | null;
    previewUrl: string | null;
    fileUrl: string | null;
  }>;
};

type DashboardBrandListProps = {
  items: DashboardBrandListItem[];
};

export function DashboardBrandList({ items }: DashboardBrandListProps) {
  if (!items.length) {
    return (
      <div className="empty-state-block">
        <h3>No brands yet</h3>
        <p>Nu exista branduri in baza de date.</p>
      </div>
    );
  }

  return (
    <div className="admin-list">
      {items.map((item) => (
        <article key={item.id} className="admin-list-item">
          <div className="admin-list-copy">
            <strong>{item.name}</strong>
            <span>Slug: {item.slug}</span>
            <span>Vizibil: {item.isVisible ? "Da" : "Nu"}</span>
            {item.description ? <span>{item.description}</span> : null}
            <DashboardDeleteButton
              endpoint={`/api/admin/brands/${item.id}`}
              label={item.name}
            />
          </div>

          <div className="admin-folder-toggle-visual">
            {item.logoUrl || item.coverImageUrl || item.mediaItems?.[0]?.thumbnailUrl || item.mediaItems?.[0]?.previewUrl || item.mediaItems?.[0]?.fileUrl ? (
              <img
                src={
                  item.logoUrl ||
                  item.coverImageUrl ||
                  item.mediaItems?.[0]?.thumbnailUrl ||
                  item.mediaItems?.[0]?.previewUrl ||
                  item.mediaItems?.[0]?.fileUrl ||
                  ""
                }
                alt={item.name}
              />
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
