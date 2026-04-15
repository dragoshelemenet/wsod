import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";
import { hasAdminSession } from "@/lib/auth/session";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    redirect("/studio-login");
  }

  return (
    <main className="inner-page">
      <section className="inner-section dashboard-layout-shell">
        <DashboardNavbar />
        <div className="dashboard-layout-content">{children}</div>
      </section>
    </main>
  );
}
