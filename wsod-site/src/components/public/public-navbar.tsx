"use client";

import { useEffect, useRef, useState } from "react";

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

type PublicNavbarProps = {
  logoUrl?: string | null;
};

export function PublicNavbar({ logoUrl }: PublicNavbarProps) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setOpen(false);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;

      ticking = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const diff = currentY - lastScrollY.current;

        // mereu vizibil aproape de top
        if (currentY < 80) {
          setHidden(false);
          lastScrollY.current = currentY;
          ticking = false;
          return;
        }

        // daca meniul mobil e deschis,nu il ascunde
        if (open) {
          setHidden(false);
          lastScrollY.current = currentY;
          ticking = false;
          return;
        }

        // scroll down mai clar -> ascunde
        if (diff > 14) {
          setHidden(true);
        }

        // scroll up mai clar -> arata
        if (diff < -14) {
          setHidden(false);
        }

        lastScrollY.current = currentY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <nav
      className={`public-navbar ${hidden ? "is-hidden" : ""} ${open ? "is-menu-open" : ""}`}
      aria-label="Public navigation"
    >
      <div className="public-navbar-inner">
        <div className="public-navbar-top">
          <a className="public-navbar-logo" href="/" aria-label="WSOD Home">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="WSOD"
                className="public-navbar-logo-image"
              />
            ) : (
              <span className="public-navbar-logo-text">WSOD</span>
            )}
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
