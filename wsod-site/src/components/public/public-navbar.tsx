"use client";

import { useEffect, useState } from "react";

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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setOpen(false);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <nav className="public-navbar" aria-label="Public navigation">
      <div className="public-navbar-inner">
        <div className="public-navbar-top">
          <a className="public-navbar-logo" href="/">
            WSOD
          </a>

          <button
            type="button"
            className={`public-navbar-toggle ${open ? "is-open" : ""}`}
            aria-expanded={open}
            aria-controls="public-mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="public-navbar-toggle-label">Meniu</span>
            <span className="public-navbar-toggle-arrow">›</span>
          </button>
        </div>

        <div className="public-navbar-links public-navbar-links-desktop">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="public-navbar-link">
              {link.label}
            </a>
          ))}
        </div>

        <div
          id="public-mobile-menu"
          className={`public-navbar-mobile ${open ? "is-open" : ""}`}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="public-navbar-link"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
