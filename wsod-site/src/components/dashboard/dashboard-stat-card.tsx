type DashboardStatCardProps = {
  label: string;
  value: string;
  helper?: string;
};

export function DashboardStatCard({
  label,
  value,
  helper,
}: DashboardStatCardProps) {
  return (
    <article className="dashboard-stat-card">
      <span className="dashboard-stat-label">{label}</span>
      <strong className="dashboard-stat-value">{value}</strong>
      {helper ? <p className="dashboard-stat-helper">{helper}</p> : null}
    </article>
  );
}
