"use client";

import { useState } from "react";

export default function HeroClient({
  contactHref,
  claimHref,
  contactLabel,
  claimLabel,
}: {
  contactHref: string;
  claimHref: string;
  contactLabel: string;
  claimLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="hero hero-home-clean">
      <div className="hero-home-mobilebar">
        <button
          type="button"
          className={`hero-mobile-menu-btn${open ? " is-open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`hero-mobile-menu${open ? " is-open" : ""}`}>
          <a href="/servicii-preturi" className="hero-mobile-menu-link">
            Servicii & prețuri
          </a>
          <a href={contactHref} className="hero-mobile-menu-link">
            {contactLabel}
          </a>
          <a
            href={claimHref}
            className="hero-mobile-menu-link hero-mobile-menu-link-primary"
          >
            {claimLabel}
          </a>
        </div>
      </div>

      <div className="hero-logo-wrap hero-logo-wrap-reference">
        <div className="hero-logo">WSOD</div>
        <div className="hero-logo-sub">PROD</div>
      </div>

      <div className="hero-copy hero-copy-reference">
        <h1>
          Te ajutăm cu video, foto, design, website-uri și content pentru social
          media.
        </h1>
      </div>

      <div className="hero-home-actions">
        <a href="/servicii-preturi" className="hero-quick-link">
          Servicii & prețuri
        </a>

        <a href={contactHref} className="hero-quick-link">
          {contactLabel}
        </a>

        <a href={claimHref} className="hero-quick-link hero-quick-link-primary">
          {claimLabel}
        </a>
      </div>
    </section>
  );
}
