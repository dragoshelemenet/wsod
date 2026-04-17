const links = [
  { href: "/studio-dashboard", label: "Overview" },
  { href: "/studio-dashboard/media", label: "Media" },
  { href: "/studio-dashboard/brands", label: "Brands" },
  { href: "/studio-dashboard/models", label: "Models" },
  { href: "/studio-dashboard/artists", label: "Artists" },
  { href: "/studio-dashboard/influencers", label: "Influencers" },
  { href: "/studio-dashboard/audio", label: "Audio" },
  { href: "/studio-dashboard/upload", label: "Upload" },
  { href: "/studio-dashboard/site-content", label: "Site Content" },
  { href: "/studio-dashboard/visibility", label: "Visibility" },
  { href: "/studio-dashboard/blog", label: "Blog" },
  { href: "/studio-dashboard/seo", label: "SEO" },
];

export function DashboardNavbar() {
  return (
    <nav className="dashboard-navbar" aria-label="Dashboard navigation">
      <div className="dashboard-navbar-head">
        <a href="/studio-dashboard" className="dashboard-navbar-title">
          Studio Dashboard
        </a>
        <p className="dashboard-navbar-copy">
          Panou minimalist, rapid si usor de folosit.
        </p>
      </div>

      <div className="dashboard-navbar-links">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="dashboard-navbar-link">
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
