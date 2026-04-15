type DashboardActionCardProps = {
  title: string;
  description: string;
  href: string;
};

export function DashboardActionCard({
  title,
  description,
  href,
}: DashboardActionCardProps) {
  return (
    <a href={href} className="dashboard-action-card">
      <strong>{title}</strong>
      <span>{description}</span>
    </a>
  );
}
