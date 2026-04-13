import type { ReactNode } from "react";
import Link from "next/link";

const DASHBOARD_LINKS = [
  { href: "/studio-dashboard", label: "Overview" },
  { href: "/studio-dashboard/media", label: "Media" },
  { href: "/studio-dashboard/models", label: "Models" },
  { href: "/studio-dashboard/brands", label: "Brands" },
  { href: "/studio-dashboard/audio", label: "Audio" },
  { href: "/studio-dashboard/upload", label: "Upload" },
  { href: "/studio-dashboard/site-content", label: "Site content" },
  { href: "/studio-dashboard/visibility", label: "Visibility" },
  { href: "/studio-dashboard/blog", label: "Blog" },
  { href: "/studio-dashboard/seo", label: "SEO" },
];

export default function StudioDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-top">
          <p className="dashboard-kicker">WSOD</p>
          <h2 className="dashboard-title">Studio Dashboard</h2>
          <p className="dashboard-sidebar-copy">
            Minimal, rapid si clar pentru administrarea site-ului.
          </p>
        </div>

        <nav className="dashboard-nav">
          {DASHBOARD_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="dashboard-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="dashboard-content">{children}</div>
    </div>
  );
}
