import { DashboardDeleteButton } from "@/components/dashboard/dashboard-delete-button";

type DashboardBlogListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: string;
  coverImageUrl: string | null;
};

type DashboardBlogListProps = {
  items: DashboardBlogListItem[];
};

export function DashboardBlogList({ items }: DashboardBlogListProps) {
  if (!items.length) {
    return (
      <div className="empty-state-block">
        <h3>No blog posts yet</h3>
        <p>Nu exista articole in baza de date.</p>
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
            <span>Status: {item.status}</span>
            {item.excerpt ? <span>{item.excerpt}</span> : null}

            <div className="site-content-actions">
              <a className="admin-submit" href={`/studio-dashboard/blog/${item.id}`}>
                Edit
              </a>
              <DashboardDeleteButton
                endpoint={`/api/admin/blog/${item.id}`}
                label={item.title}
              />
            </div>
          </div>

          <div className="admin-folder-toggle-visual">
            {item.coverImageUrl ? (
              <img src={item.coverImageUrl} alt={item.title} />
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
