import type { ReactNode } from "react";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <main className="inner-page">
      <section className="inner-section dashboard-layout-shell">
        <DashboardNavbar />
        <div className="dashboard-layout-content">{children}</div>
      </section>
    </main>
  );
}
