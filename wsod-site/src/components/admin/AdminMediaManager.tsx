"use client";

import { useMemo, useState } from "react";

interface AdminMediaItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: string;
  date: string | Date;
  description?: string | null;
  seoTitle?: string | null;
  metaDescription?: string | null;
  groupLabel?: string | null;
  groupOrder?: number;
  sortOrder?: number;
  graphicKind?: string | null;
  isFeatured?: boolean;
  thumbnailUrl?: string | null;
  previewUrl?: string | null;
  fileUrl?: string | null;
  brand?: { name: string; slug: string } | null;
  personModel?: { name: string; slug: string } | null;
  audioProfile?: { name: string; slug: string; kind: string } | null;
}

interface AdminMediaManagerClientProps {
  initialItems: AdminMediaItem[];
}

function graphicKindOptions() {
  return [
    { value: "", label: "fără tip" },
    { value: "flyer", label: "flyer" },
    { value: "business-card", label: "business-card" },
    { value: "banner-ad", label: "banner-ad" },
    { value: "menu-redesign", label: "menu-redesign" },
    { value: "logo-reinvented", label: "logo-reinvented" },
    { value: "menu", label: "menu" },
  ];
}

export default function AdminMediaManager({
  initialItems,
}: AdminMediaManagerClientProps) {
  const [items, setItems] = useState(initialItems);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const groupedHint = useMemo(
    () =>
      "Pentru modele foto folosește groupLabel gen: Outfit schimbat / Outfit original. Pentru grafică folosește graphicKind.",
    []
  );

  async function saveItem(item: AdminMediaItem) {
    setSavingId(item.id);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/media/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title,
          description: item.description || "",
          seoTitle: item.seoTitle || "",
          metaDescription: item.metaDescription || "",
          groupLabel: item.groupLabel || "",
          graphicKind: item.graphicKind || "",
          groupOrder: item.groupOrder ?? 0,
          sortOrder: item.sortOrder ?? 0,
          isFeatured: !!item.isFeatured,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Nu s-a putut salva.");
      }

      setMessage("Fișierele au fost actualizate.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscută.");
    } finally {
      setSavingId(null);
    }
  }

  function patchItem(id: string, patch: Partial<AdminMediaItem>) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }

  return (
    <div className="admin-panel-card">
      <div className="admin-card-head">
        <h2>Media manager</h2>
      </div>

      <div className="admin-stack">
        <p className="admin-helper-text">{groupedHint}</p>

        {message ? (
          <p className={message.includes("actualizate") ? "admin-success" : "admin-error"}>
            {message}
          </p>
        ) : null}

        <div className="admin-list">
          {items.map((item) => {
            const ownerName = item.brand?.name || item.personModel?.name || item.audioProfile?.name || "Fără owner";
            const preview = item.thumbnailUrl || item.previewUrl || item.fileUrl || null;

            return (
              <div key={item.id} className="admin-list-item admin-list-item-column">
                <div className="admin-media-edit-layout">
                  <div className="admin-media-edit-preview">
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview} alt={item.title} />
                    ) : (
                      <div className="media-thumb-fallback">{item.type.toUpperCase()}</div>
                    )}
                  </div>

                  <div className="admin-media-edit-form">
                    <div className="admin-form-field">
                      <label>Titlu</label>
                      <input
                        value={item.title}
                        onChange={(e) => patchItem(item.id, { title: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-field">
                      <label>Descriere</label>
                      <textarea
                        rows={3}
                        value={item.description || ""}
                        onChange={(e) => patchItem(item.id, { description: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-field">
                      <label>SEO title</label>
                      <input
                        value={item.seoTitle || ""}
                        onChange={(e) => patchItem(item.id, { seoTitle: e.target.value })}
                      />
                    </div>

                    <div className="admin-form-field">
                      <label>Meta description</label>
                      <textarea
                        rows={3}
                        value={item.metaDescription || ""}
                        onChange={(e) => patchItem(item.id, { metaDescription: e.target.value })}
                      />
                    </div>

                    <div className="admin-media-grid-2">
                      <div className="admin-form-field">
                        <label>Group label</label>
                        <input
                          placeholder="ex: Outfit schimbat"
                          value={item.groupLabel || ""}
                          onChange={(e) => patchItem(item.id, { groupLabel: e.target.value })}
                        />
                      </div>

                      <div className="admin-form-field">
                        <label>Graphic kind</label>
                        <select
                          className="admin-select"
                          value={item.graphicKind || ""}
                          onChange={(e) => patchItem(item.id, { graphicKind: e.target.value })}
                        >
                          {graphicKindOptions().map((option) => (
                            <option key={option.value || "empty"} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="admin-form-field">
                        <label>Group order</label>
                        <input
                          type="number"
                          value={item.groupOrder ?? 0}
                          onChange={(e) =>
                            patchItem(item.id, { groupOrder: Number(e.target.value || 0) })
                          }
                        />
                      </div>

                      <div className="admin-form-field">
                        <label>Sort order</label>
                        <input
                          type="number"
                          value={item.sortOrder ?? 0}
                          onChange={(e) =>
                            patchItem(item.id, { sortOrder: Number(e.target.value || 0) })
                          }
                        />
                      </div>
                    </div>

                    <label className="admin-checkbox-row">
                      <input
                        type="checkbox"
                        checked={!!item.isFeatured}
                        onChange={(e) => patchItem(item.id, { isFeatured: e.target.checked })}
                      />
                      <span>Featured</span>
                    </label>

                    <div className="admin-list-copy">
                      <span>
                        {item.category} • {ownerName} • {new Date(item.date).toLocaleDateString("ro-RO")}
                      </span>
                    </div>

                    <div className="admin-inline-actions">
                      <button
                        type="button"
                        className="admin-submit"
                        onClick={() => saveItem(item)}
                        disabled={savingId === item.id}
                      >
                        {savingId === item.id ? "Se salvează..." : "Salvează"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!items.length ? (
          <p className="admin-helper-text">Nu există fișiere pentru editare.</p>
        ) : null}
      </div>
    </div>
  );
}
