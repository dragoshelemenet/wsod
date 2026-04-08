"use client";

import { useMemo, useState } from "react";

interface BrandFormProps {
  brands: {
    id: string;
    name: string;
    slug: string;
  }[];
  onBrandSelect: (brandSlug: string) => void;
}

export default function BrandForm({ brands, onBrandSelect }: BrandFormProps) {
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [selectedBrand, setSelectedBrand] = useState(brands[0]?.slug ?? "");
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandSlug, setNewBrandSlug] = useState("");

  const normalizedNewSlug = useMemo(() => {
    return newBrandSlug.trim().toLowerCase().replace(/\s+/g, "-");
  }, [newBrandSlug]);

  function handleUseExisting(brandSlug: string) {
    setSelectedBrand(brandSlug);
    onBrandSelect(brandSlug);
  }

  function handleUseNewBrandPreview() {
    if (!normalizedNewSlug || !newBrandName.trim()) return;
    onBrandSelect(normalizedNewSlug);
  }

  return (
    <div className="admin-panel-card">
      <div className="admin-card-head">
        <h2>1. Brand</h2>
        <div className="admin-switches">
          <button
            type="button"
            className={mode === "existing" ? "admin-switch active" : "admin-switch"}
            onClick={() => setMode("existing")}
          >
            Brand existent
          </button>
          <button
            type="button"
            className={mode === "new" ? "admin-switch active" : "admin-switch"}
            onClick={() => setMode("new")}
          >
            Brand nou
          </button>
        </div>
      </div>

      {mode === "existing" ? (
        <div className="admin-stack">
          <select
            className="admin-select"
            value={selectedBrand}
            onChange={(event) => handleUseExisting(event.target.value)}
          >
            {brands.map((brand) => (
              <option key={brand.id} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={() => handleUseExisting(selectedBrand)}
          >
            Selectează brandul
          </button>
        </div>
      ) : (
        <div className="admin-stack">
          <div className="admin-form-field">
            <label htmlFor="new-brand-name-preview">Nume brand</label>
            <input
              id="new-brand-name-preview"
              type="text"
              value={newBrandName}
              onChange={(event) => setNewBrandName(event.target.value)}
              placeholder="Ex: Mosimo Barbershop"
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="new-brand-slug-preview">Slug brand</label>
            <input
              id="new-brand-slug-preview"
              type="text"
              value={newBrandSlug}
              onChange={(event) => setNewBrandSlug(event.target.value)}
              placeholder="Ex: mosimo-barbershop"
            />
          </div>

          <p className="admin-helper-text">
            Pentru creare reală folosește secțiunea „Creează brand nou” de mai jos.
          </p>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={handleUseNewBrandPreview}
          >
            Folosește preview brand nou
          </button>
        </div>
      )}
    </div>
  );
}