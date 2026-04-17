import { getDashboardTalents } from "@/lib/dashboard/queries";

export default async function DashboardTalentsPage() {
  const items = await getDashboardTalents();

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell-head">
        <h1>Talents</h1>
        <p>Artist și influencer profiles foundation.</p>
      </div>

      <div className="admin-list compact-admin-list">
        {items.map((item) => (
          <article key={item.id} className="admin-list-item">
            <div className="admin-card-head">
              <h3>{item.name}</h3>
              <span>{item.kind}</span>
            </div>
            <p className="admin-helper-text">{item.slug}</p>
          </article>
        ))}

        {!items.length ? (
          <div className="empty-state-block">
            <h3>No talents yet</h3>
            <p>Nu există încă artisti sau influenceri.</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
