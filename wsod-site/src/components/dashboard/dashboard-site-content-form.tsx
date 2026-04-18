"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type SiteContentRecord = {
  id: string;
  homeLogoUrl: string | null;
  servicesEyebrow: string | null;
  servicesTitle: string | null;
  servicesList: string | null;
  servicesCards: string | null;
  packageCards: string | null;
  servicesTableRows: string | null;
  servicesCertificatesTitle: string | null;
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

type ServiceTableRow = {
  category: string;
  service: string;
  price: string;
  note: string;
};

type ServiceCardRow = {
  title: string;
  description: string;
  currentPrice: string;
  discount: string;
  oldPrice: string;
};

const CATEGORY_OPTIONS = [
  { value: "foto", label: "Foto" },
  { value: "video", label: "Video" },
  { value: "grafica", label: "Grafica" },
  { value: "website", label: "Website" },
  { value: "meta-ads", label: "Meta Ads" },
  { value: "audio", label: "Audio" },
];

function parseTableRows(value: string | null | undefined): ServiceTableRow[] {
  return (value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [category = "", service = "", price = "", note = ""] = line
        .split("|")
        .map((part) => part.trim());

      return { category, service, price, note };
    });
}

function serializeTableRows(rows: ServiceTableRow[]) {
  return rows
    .map((row) => [row.category, row.service, row.price, row.note].map((x) => x.trim()).join("|"))
    .filter((line) => line.replace(/\|/g, "").trim())
    .join("\n");
}

function parseServiceCards(value: string | null | undefined): ServiceCardRow[] {
  return (value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title = "", description = "", currentPrice = "", discount = "", oldPrice = ""] = line
        .split("|")
        .map((part) => part.trim());

      return { title, description, currentPrice, discount, oldPrice };
    });
}

function serializeServiceCards(rows: ServiceCardRow[]) {
  return rows
    .map((row) =>
      [row.title, row.description, row.currentPrice, row.discount, row.oldPrice]
        .map((x) => x.trim())
        .join("|")
    )
    .filter((line) => line.replace(/\|/g, "").trim())
    .join("\n");
}

export function DashboardSiteContentForm({
  item,
}: DashboardSiteContentFormProps) {
  const router = useRouter();
  const [homeLogoUrl, setHomeLogoUrl] = useState(item?.homeLogoUrl || "");
  const [servicesEyebrow, setServicesEyebrow] = useState(item?.servicesEyebrow || "");
  const [servicesTitle, setServicesTitle] = useState(item?.servicesTitle || "");
  const [servicesList, setServicesList] = useState(item?.servicesList || "");
  const [packageCards, setPackageCards] = useState(item?.packageCards || "");
  const [servicesCertificatesTitle, setServicesCertificatesTitle] = useState(
    item?.servicesCertificatesTitle || ""
  );
  const [pricingLabel, setPricingLabel] = useState(item?.pricingLabel || "");
  const [pricingHref, setPricingHref] = useState(item?.pricingHref || "");
  const [contactLabel, setContactLabel] = useState(item?.contactLabel || "");
  const [contactHref, setContactHref] = useState(item?.contactHref || "");
  const [claimLabel, setClaimLabel] = useState(item?.claimLabel || "");
  const [claimHref, setClaimHref] = useState(item?.claimHref || "");
  const [tableRows, setTableRows] = useState<ServiceTableRow[]>(
    parseTableRows(item?.servicesTableRows).length
      ? parseTableRows(item?.servicesTableRows)
      : [{ category: "foto", service: "", price: "", note: "" }]
  );
  const [serviceCardRows, setServiceCardRows] = useState<ServiceCardRow[]>(
    parseServiceCards(item?.servicesCards).length
      ? parseServiceCards(item?.servicesCards)
      : [{ title: "", description: "", currentPrice: "", discount: "", oldPrice: "" }]
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const serializedTableRows = useMemo(() => serializeTableRows(tableRows), [tableRows]);
  const serializedServiceCards = useMemo(
    () => serializeServiceCards(serviceCardRows),
    [serviceCardRows]
  );

  function updateRow(index: number, patch: Partial<ServiceTableRow>) {
    setTableRows((current) =>
      current.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row))
    );
  }

  function addRow() {
    setTableRows((current) => [
      ...current,
      { category: "foto", service: "", price: "", note: "" },
    ]);
  }

  function removeRow(index: number) {
    setTableRows((current) =>
      current.length === 1
        ? [{ category: "foto", service: "", price: "", note: "" }]
        : current.filter((_, i) => i !== index)
    );
  }

  function updateServiceCardRow(index: number, patch: Partial<ServiceCardRow>) {
    setServiceCardRows((current) =>
      current.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row))
    );
  }

  function addServiceCardRow() {
    setServiceCardRows((current) => [
      ...current,
      { title: "", description: "", currentPrice: "", discount: "", oldPrice: "" },
    ]);
  }

  function removeServiceCardRow(index: number) {
    setServiceCardRows((current) =>
      current.length === 1
        ? [{ title: "", description: "", currentPrice: "", discount: "", oldPrice: "" }]
        : current.filter((_, i) => i !== index)
    );
  }

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
          servicesCards: serializedServiceCards,
          packageCards,
          servicesTableRows: serializedTableRows,
          servicesCertificatesTitle,
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

      setMessage("Site Content salvat cu succes.");
      router.refresh();
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
          <label>Tabel servicii</label>
          <div className="services-table-editor">
            {tableRows.map((row, index) => (
              <div key={index} className="services-table-editor-row">
                <select
                  className="admin-select"
                  value={row.category}
                  onChange={(e) => updateRow(index, { category: e.target.value })}
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <input
                  value={row.service}
                  onChange={(e) => updateRow(index, { service: e.target.value })}
                  placeholder="Serviciu"
                />

                <input
                  value={row.price}
                  onChange={(e) => updateRow(index, { price: e.target.value })}
                  placeholder="Pret"
                />

                <input
                  value={row.note}
                  onChange={(e) => updateRow(index, { note: e.target.value })}
                  placeholder="Detalii"
                />

                <button
                  type="button"
                  className="admin-ghost-button"
                  onClick={() => removeRow(index)}
                >
                  Șterge
                </button>
              </div>
            ))}
          </div>

          <div className="site-content-actions">
            <button type="button" className="admin-ghost-button" onClick={addRow}>
              + Adaugă rând
            </button>
          </div>
        </div>

        <div className="admin-form-field site-content-full">
          <label>Services Cards (Titlu | Descriere | Pret actual | Reducere | Pret vechi taiat)</label>

          <div className="services-table-editor">
            {serviceCardRows.map((row, index) => (
              <div key={index} className="services-table-editor-row services-card-editor-row">
                <input
                  value={row.title}
                  onChange={(e) => updateServiceCardRow(index, { title: e.target.value })}
                  placeholder="Titlu"
                />

                <input
                  value={row.description}
                  onChange={(e) => updateServiceCardRow(index, { description: e.target.value })}
                  placeholder="Descriere"
                />

                <input
                  value={row.currentPrice}
                  onChange={(e) => updateServiceCardRow(index, { currentPrice: e.target.value })}
                  placeholder="Pret actual ex: 149 ron"
                />

                <input
                  value={row.discount}
                  onChange={(e) => updateServiceCardRow(index, { discount: e.target.value })}
                  placeholder="Reducere ex: -50%"
                />

                <input
                  value={row.oldPrice}
                  onChange={(e) => updateServiceCardRow(index, { oldPrice: e.target.value })}
                  placeholder="Pret vechi taiat ex: 298 ron"
                />

                <button
                  type="button"
                  className="admin-ghost-button"
                  onClick={() => removeServiceCardRow(index)}
                >
                  Șterge
                </button>
              </div>
            ))}
          </div>

          <div className="site-content-actions">
            <button type="button" className="admin-ghost-button" onClick={addServiceCardRow}>
              + Adaugă card
            </button>
          </div>
        </div>

        <div className="admin-form-field site-content-full">
          <label>Package Cards</label>
          <textarea
            className="admin-textarea"
            value={packageCards}
            onChange={(e) => setPackageCards(e.target.value)}
          />
        </div>

        <div className="admin-form-field site-content-full">
          <label>Services Certificates Title</label>
          <input
            value={servicesCertificatesTitle}
            onChange={(e) => setServicesCertificatesTitle(e.target.value)}
            placeholder="Certificate"
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
