import type { ReactNode } from "react";

type DashboardShellProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function DashboardShell({
  title,
  description,
  children,
}: DashboardShellProps) {
  return (
    <div className="dashboard-shell">
      <div className="dashboard-shell-head">
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </div>
  );
}
