"use client";

import { useMemo, useState } from "react";
import { featuredBrands } from "@/lib/data/home-data";

interface EditableBrand {
  name: string;
  slug: string;
  hidden?: boolean;
}

export default function AdminBrandManager() {
  const [brands, setBrands] = useState<EditableBrand[]>(
    featuredBrands.map((brand) => ({
      ...brand,
      hidden: false,
    }))
  );

  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedSlug, setEditedSlug] = useState("");

  const visibleBrands = useMemo(
    () => brands.filter((brand) => !brand.hidden),
    [brands]
  );

  function startEdit(brand: EditableBrand) {
    setEditingSlug(brand.slug);
    setEditedName(brand.name);
    setEditedSlug(brand.slug);
  }

  function saveEdit() {
    if (!editingSlug) return;

    const normalizedSlug = editedSlug.trim().toLowerCase().replace(/\s+/g, "-");
    const normalizedName = editedName.trim();

    if (!normalizedSlug || !normalizedName) return;

    setBrands((current) =>
      current.map((brand) =>
        brand.slug === editingSlug
          ? {
              ...brand,
              name: normalizedName,
              slug: normalizedSlug,
            }
          : brand
      )
    );

    setEditingSlug(null);
    setEditedName("");
    setEditedSlug("");
  }

  function cancelEdit() {
    setEditingSlug(null);
    setEditedName("");
    setEditedSlug("");
  }

  function toggleHide(slug: string) {
    setBrands((current) =>
      current.map((brand) =>
        brand.slug === slug ? { ...brand, hidden: !brand.hidden } : brand
      )
    );
  }

  function removeBrand(slug: string) {
    setBrands((current) => current.filter((brand) => brand.slug !== slug));
  }

  return (
    <div className="admin-panel-card">
      <div className="admin-card-head">
        <h2>3. Administrare branduri</h2>
      </div>

      <div className="admin-stack">
        <p className="admin-helper-text">
          Aici simulezi editarea brandurilor: rename, hide și delete. În etapa
          următoare le legăm la date reale.
        </p>

        <div className="admin-list">
          {brands.map((brand) => {
            const isEditing = editingSlug === brand.slug;

            return (
              <div key={brand.slug} className="admin-list-item">
                {isEditing ? (
                  <div className="admin-stack">
                    <div className="admin-form-field">
                      <label htmlFor={`name-${brand.slug}`}>Nume brand</label>
                      <input
                        id={`name-${brand.slug}`}
                        type="text"
                        value={editedName}
                        onChange={(event) => setEditedName(event.target.value)}
                      />
                    </div>

                    <div className="admin-form-field">
                      <label htmlFor={`slug-${brand.slug}`}>Slug brand</label>
                      <input
                        id={`slug-${brand.slug}`}
                        type="text"
                        value={editedSlug}
                        onChange={(event) => setEditedSlug(event.target.value)}
                      />
                    </div>

                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={saveEdit}
                      >
                        Salvează
                      </button>
                      <button
                        type="button"
                        className="admin-ghost-button"
                        onClick={cancelEdit}
                      >
                        Anulează
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="admin-list-copy">
                      <strong>{brand.name}</strong>
                      <span>
                        /brand/{brand.slug} {brand.hidden ? "• ascuns" : ""}
                      </span>
                    </div>

                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        className="admin-ghost-button"
                        onClick={() => startEdit(brand)}
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        className="admin-ghost-button"
                        onClick={() => toggleHide(brand.slug)}
                      >
                        {brand.hidden ? "Arată" : "Ascunde"}
                      </button>
                      <button
                        type="button"
                        className="admin-danger-button"
                        onClick={() => removeBrand(brand.slug)}
                      >
                        Șterge
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="admin-summary-box">
          <p>
            <strong>Branduri vizibile:</strong> {visibleBrands.length}
          </p>
          <p>
            <strong>Branduri totale:</strong> {brands.length}
          </p>
        </div>
      </div>
    </div>
  );
}