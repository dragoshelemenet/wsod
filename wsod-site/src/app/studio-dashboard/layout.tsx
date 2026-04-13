import type { ReactNode } from "react";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <main className="inner-page">
      <section className="inner-section">{children}</section>
    </main>
  );
}
