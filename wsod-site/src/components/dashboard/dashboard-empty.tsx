type DashboardEmptyProps = {
  title: string;
  description: string;
};

export function DashboardEmpty({ title, description }: DashboardEmptyProps) {
  return (
    <div className="empty-state-block">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
