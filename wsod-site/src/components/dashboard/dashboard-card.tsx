import type { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function DashboardCard({
  title,
  description,
  children,
}: DashboardCardProps) {
  return (
    <section className="dashboard-card">
      <div className="dashboard-card-head">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
