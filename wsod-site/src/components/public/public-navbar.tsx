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
  const anchorY = useRef(0);
  const hiddenAtY = useRef<number | null>(null);
  const maxHiddenY = useRef<number | null>(null);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setOpen(false);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    anchorY.current = window.scrollY;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const direction = currentY > lastScrollY.current ? "down" : "up";

        if (currentY <= 50) {
          setHidden(false);
          anchorY.current = currentY;
          hiddenAtY.current = null;
          maxHiddenY.current = null;
          lastScrollY.current = currentY;
          ticking = false;
          return;
        }

        if (open) {
          setHidden(false);
          anchorY.current = currentY;
          hiddenAtY.current = null;
          maxHiddenY.current = null;
          lastScrollY.current = currentY;
          ticking = false;
          return;
        }

        if (!hidden) {
          if (direction === "down") {
            const downDistance = currentY - anchorY.current;

            if (downDistance >= 50) {
              setHidden(true);
              hiddenAtY.current = currentY;
              maxHiddenY.current = currentY;
            }
          } else {
            anchorY.current = currentY;
          }
        } else {
          if (direction === "down") {
            if (maxHiddenY.current === null || currentY > maxHiddenY.current) {
              maxHiddenY.current = currentY;
            }
          } else {
            const hidePoint = hiddenAtY.current ?? currentY;
            const farthestPoint = maxHiddenY.current ?? currentY;
            const extraDownAfterHide = Math.max(0, farthestPoint - hidePoint);
            const showThreshold = extraDownAfterHide <= 50 ? 50 : 100;
            const upDistance = farthestPoint - currentY;

            if (upDistance >= showThreshold) {
              setHidden(false);
              anchorY.current = currentY;
              hiddenAtY.current = null;
              maxHiddenY.current = null;
            }
          }
        }

        lastScrollY.current = currentY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open, hidden]);

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
