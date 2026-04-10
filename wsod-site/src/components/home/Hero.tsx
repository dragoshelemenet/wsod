"use client";

import { useState } from "react";
import { getSiteContentFromDb } from "@/lib/data/site-content";

export default async function Hero() {
  const content = await getSiteContentFromDb();

  const contactHref = content.contactHref || "https://wa.me/40727205689";
  const claimHref =
    content.claimHref ||
    "https://wa.me/40727205689?text=Salut%2C%20vreau%20primul%20video%20sau%20foto%20gratis";

  return (
    <HeroClient
      contactHref={contactHref}
      claimHref={claimHref}
      pricingHref={content.pricingHref || "/servicii-preturi"}
      pricingLabel={content.pricingLabel || "Servicii & prețuri"}
      contactLabel={content.contactLabel || "Contact"}
      claimLabel={content.claimLabel || "Primul video/foto gratis"}
    />
  );
}

function HeroClient({
  pricingHref,
  pricingLabel,
  contactHref,
  contactLabel,
  claimHref,
  claimLabel,
}: {
  pricingHref: string;
  pricingLabel: string;
  contactHref: string;
  contactLabel: string;
  claimHref: string;
  claimLabel: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isExternal = (href: string) => href.startsWith("http");

  return (
    <section className="hero hero-home-clean">
      <div className="hero-home-mobilebar">
        <button
          type="button"
          className={`hero-mobile-menu-btn ${menuOpen ? "is-open" : ""}`}
          aria-label="Deschide meniul"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`hero-mobile-menu ${menuOpen ? "is-open" : ""}`}>
          <a href={pricingHref} className="hero-mobile-menu-link">
            {pricingLabel}
          </a>

          <a
            href={contactHref}
            className="hero-mobile-menu-link"
            target={isExternal(contactHref) ? "_blank" : undefined}
            rel={isExternal(contactHref) ? "noreferrer" : undefined}
          >
            {contactLabel}
          </a>

          <a
            href={claimHref}
            className="hero-mobile-menu-link hero-mobile-menu-link-primary"
            target={isExternal(claimHref) ? "_blank" : undefined}
            rel={isExternal(claimHref) ? "noreferrer" : undefined}
          >
            {claimLabel}
          </a>
        </div>
      </div>

      <div className="hero-logo-wrap">
        <div className="hero-logo">WSOD</div>
        <div className="hero-logo-sub hero-logo-sub-copy">
          Te ajutăm cu video, editare video, design, poze și pachete avantajoase
          pentru dezvoltarea brandului și pentru social media.
        </div>
      </div>

      <nav className="hero-home-actions" aria-label="Navigație homepage">
        <a href={pricingHref} className="hero-quick-link">
          {pricingLabel}
        </a>

        <a
          href={contactHref}
          className="hero-quick-link"
          target={isExternal(contactHref) ? "_blank" : undefined}
          rel={isExternal(contactHref) ? "noreferrer" : undefined}
        >
          {contactLabel}
        </a>

        <a
          href={claimHref}
          className="hero-quick-link hero-quick-link-primary"
          target={isExternal(claimHref) ? "_blank" : undefined}
          rel={isExternal(claimHref) ? "noreferrer" : undefined}
        >
          {claimLabel}
        </a>
      </nav>
    </section>
  );
}
