type DashboardMediaListItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: string;
  isVisible: boolean;
  isFeatured: boolean;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  fileUrl: string | null;
  brand?: { name: string } | null;
  personModel?: { name: string } | null;
  audioProfile?: { name: string } | null;
};

type DashboardMediaListProps = {
  items: DashboardMediaListItem[];
};

export function DashboardMediaList({ items }: DashboardMediaListProps) {
  if (!items.length) {
    return (
      <div className="empty-state-block">
        <h3>No media yet</h3>
        <p>Nu exista fisiere media in baza de date.</p>
      </div>
    );
  }

  return (
    <div className="admin-list">
      {items.map((item) => (
        <article key={item.id} className="admin-list-item">
          <div className="admin-list-copy">
            <strong>{item.title}</strong>
            <span>Slug: {item.slug}</span>
            <span>Categorie: {item.category}</span>
            <span>Tip: {item.type}</span>
            <span>Vizibil: {item.isVisible ? "Da" : "Nu"}</span>
            <span>Featured: {item.isFeatured ? "Da" : "Nu"}</span>
            {item.brand ? <span>Brand: {item.brand.name}</span> : null}
            {item.personModel ? <span>Model: {item.personModel.name}</span> : null}
            {item.audioProfile ? <span>Audio Profile: {item.audioProfile.name}</span> : null}
          </div>

          <div className="admin-folder-toggle-visual">
            {item.thumbnailUrl || item.previewUrl || item.fileUrl ? (
              <img
                src={item.thumbnailUrl || item.previewUrl || item.fileUrl || ""}
                alt={item.title}
              />
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
