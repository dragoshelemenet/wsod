import type { ReactNode } from "react";

type DashboardGridProps = {
  children: ReactNode;
};

export function DashboardGrid({ children }: DashboardGridProps) {
  return <div className="dashboard-grid-simple">{children}</div>;
}
