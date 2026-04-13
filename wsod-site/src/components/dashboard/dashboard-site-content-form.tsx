"use client";

import { useState } from "react";

type SiteContentRecord = {
  id: string;
  homeLogoUrl: string | null;
  servicesEyebrow: string | null;
  servicesTitle: string | null;
  servicesList: string | null;
  servicesCards: string | null;
  packageCards: string | null;
  pricingLabel: string | null;
  pricingHref: string | null;
  contactLabel: string | null;
  contactHref: string | null;
  claimLabel: string | null;
  claimHref: string | null;
};

type DashboardSiteContentFormProps = {
  item: SiteContentRecord | null;
};

export function DashboardSiteContentForm({
  item,
}: DashboardSiteContentFormProps) {
  const [homeLogoUrl, setHomeLogoUrl] = useState(item?.homeLogoUrl || "");
  const [servicesEyebrow, setServicesEyebrow] = useState(item?.servicesEyebrow || "");
  const [servicesTitle, setServicesTitle] = useState(item?.servicesTitle || "");
  const [servicesList, setServicesList] = useState(item?.servicesList || "");
  const [servicesCards, setServicesCards] = useState(item?.servicesCards || "");
  const [packageCards, setPackageCards] = useState(item?.packageCards || "");
  const [pricingLabel, setPricingLabel] = useState(item?.pricingLabel || "");
  const [pricingHref, setPricingHref] = useState(item?.pricingHref || "");
  const [contactLabel, setContactLabel] = useState(item?.contactLabel || "");
  const [contactHref, setContactHref] = useState(item?.contactHref || "");
  const [claimLabel, setClaimLabel] = useState(item?.claimLabel || "");
  const [claimHref, setClaimHref] = useState(item?.claimHref || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/site-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: item?.id || "main",
          homeLogoUrl,
          servicesEyebrow,
          servicesTitle,
          servicesList,
          servicesCards,
          packageCards,
          pricingLabel,
          pricingHref,
          contactLabel,
          contactHref,
          claimLabel,
          claimHref,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Nu s-a putut salva Site Content.");
      }

      setMessage("Site Content salvat cu succes. Da refresh daca vrei sa vezi valorile noi.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscuta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <div className="admin-card-head">
        <h2>Site Content</h2>
      </div>

      <div className="site-content-grid">
        <div className="admin-form-field">
          <label>Home Logo URL</label>
          <input value={homeLogoUrl} onChange={(e) => setHomeLogoUrl(e.target.value)} />
        </div>

        <div className="admin-form-field">
          <label>Services Eyebrow</label>
          <input value={servicesEyebrow} onChange={(e) => setServicesEyebrow(e.target.value)} />
        </div>

        <div className="admin-form-field site-content-full">
          <label>Services Title</label>
          <input value={servicesTitle} onChange={(e) => setServicesTitle(e.target.value)} />
        </div>

        <div className="admin-form-field site-content-full">
          <label>Services List</label>
          <textarea
            className="admin-textarea"
            value={servicesList}
            onChange={(e) => setServicesList(e.target.value)}
          />
        </div>

        <div className="admin-form-field site-content-full">
          <label>Services Cards</label>
          <textarea
            className="admin-textarea"
            value={servicesCards}
            onChange={(e) => setServicesCards(e.target.value)}
          />
        </div>

        <div className="admin-form-field site-content-full">
          <label>Package Cards</label>
          <textarea
            className="admin-textarea"
            value={packageCards}
            onChange={(e) => setPackageCards(e.target.value)}
          />
        </div>

        <div className="admin-form-field">
          <label>Pricing Label</label>
          <input value={pricingLabel} onChange={(e) => setPricingLabel(e.target.value)} />
        </div>

        <div className="admin-form-field">
          <label>Pricing Href</label>
          <input value={pricingHref} onChange={(e) => setPricingHref(e.target.value)} />
        </div>

        <div className="admin-form-field">
          <label>Contact Label</label>
          <input value={contactLabel} onChange={(e) => setContactLabel(e.target.value)} />
        </div>

        <div className="admin-form-field">
          <label>Contact Href</label>
          <input value={contactHref} onChange={(e) => setContactHref(e.target.value)} />
        </div>

        <div className="admin-form-field">
          <label>Claim Label</label>
          <input value={claimLabel} onChange={(e) => setClaimLabel(e.target.value)} />
        </div>

        <div className="admin-form-field">
          <label>Claim Href</label>
          <input value={claimHref} onChange={(e) => setClaimHref(e.target.value)} />
        </div>
      </div>

      <div className="site-content-actions">
        <button className="admin-submit" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save site content"}
        </button>
      </div>

      {message ? <p className="admin-helper-text">{message}</p> : null}
    </form>
  );
}
