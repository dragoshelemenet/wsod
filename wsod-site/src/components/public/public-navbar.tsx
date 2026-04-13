const links = [
  { href: "/", label: "Home" },
  { href: "/video", label: "Video" },
  { href: "/foto", label: "Foto" },
  { href: "/grafica", label: "Grafica" },
  { href: "/website", label: "Website" },
  { href: "/meta-ads", label: "Meta Ads" },
  { href: "/audio", label: "Audio" },
  { href: "/servicii-preturi", label: "Servicii" },
];

export function PublicNavbar() {
  return (
    <nav className="public-navbar" aria-label="Public navigation">
      <div className="public-navbar-inner">
        <a className="public-navbar-logo" href="/">
          WSOD
        </a>

        <div className="public-navbar-links">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="public-navbar-link">
              {link.label}
            </a>
          ))}
        </div>

        <a className="public-navbar-cta" href="/studio-dashboard">
          Dashboard
        </a>
      </div>
    </nav>
  );
}
