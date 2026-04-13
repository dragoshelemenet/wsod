type DashboardAudioProfileListItem = {
  id: string;
  name: string;
  slug: string;
  kind: string;
  coverImageUrl: string | null;
  description: string | null;
  isVisible: boolean;
};

type DashboardAudioProfileListProps = {
  items: DashboardAudioProfileListItem[];
};

export function DashboardAudioProfileList({
  items,
}: DashboardAudioProfileListProps) {
  if (!items.length) {
    return (
      <div className="empty-state-block">
        <h3>No audio profiles yet</h3>
        <p>Nu exista audio profiles in baza de date.</p>
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
            <span>Kind: {item.kind}</span>
            <span>Vizibil: {item.isVisible ? "Da" : "Nu"}</span>
            {item.description ? <span>{item.description}</span> : null}
          </div>

          <div className="admin-folder-toggle-visual">
            {item.coverImageUrl ? (
              <img src={item.coverImageUrl} alt={item.name} />
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
