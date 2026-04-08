"use client";

import { useMemo, useState } from "react";
import { featuredBrands } from "@/lib/data/home-data";

interface BrandFormProps {
  onBrandSelect: (brandSlug: string) => void;
}

export default function BrandForm({ onBrandSelect }: BrandFormProps) {
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [selectedBrand, setSelectedBrand] = useState(featuredBrands[0]?.slug ?? "");
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandSlug, setNewBrandSlug] = useState("");

  const normalizedNewSlug = useMemo(() => {
    return newBrandSlug
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");
  }, [newBrandSlug]);

  function handleUseExisting(brandSlug: string) {
    setSelectedBrand(brandSlug);
    onBrandSelect(brandSlug);
  }

  function handleUseNewBrand() {
    if (!normalizedNewSlug) return;
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
            {featuredBrands.map((brand) => (
              <option key={brand.slug} value={brand.slug}>
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
            <label htmlFor="new-brand-name">Nume brand</label>
            <input
              id="new-brand-name"
              type="text"
              value={newBrandName}
              onChange={(event) => setNewBrandName(event.target.value)}
              placeholder="Ex: Mosimo Barbershop"
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="new-brand-slug">Slug brand</label>
            <input
              id="new-brand-slug"
              type="text"
              value={newBrandSlug}
              onChange={(event) => setNewBrandSlug(event.target.value)}
              placeholder="Ex: mosimo-barbershop"
            />
          </div>

          <p className="admin-helper-text">
            Slug folosit momentan: <strong>{normalizedNewSlug || "—"}</strong>
          </p>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={handleUseNewBrand}
          >
            Folosește acest brand nou
          </button>
        </div>
      )}
    </div>
  );
}