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
  isVisible?: boolean;
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

type OwnerType = "models" | "brands" | "audio" | "unassigned";

function getPreview(item: AdminMediaItem) {
  return item.thumbnailUrl || item.previewUrl || item.fileUrl || null;
}

function getOwnerMeta(item: AdminMediaItem): { ownerType: OwnerType; ownerName: string } {
  if (item.personModel?.name) {
    return { ownerType: "models", ownerName: item.personModel.name };
  }

  if (item.brand?.name) {
    return { ownerType: "brands", ownerName: item.brand.name };
  }

  if (item.audioProfile?.name) {
    return { ownerType: "audio", ownerName: item.audioProfile.name };
  }

  return { ownerType: "unassigned", ownerName: "Fără owner" };
}

function ownerTypeLabel(type: OwnerType) {
  switch (type) {
    case "models":
      return "Modele";
    case "brands":
      return "Branduri";
    case "audio":
      return "Audio";
    default:
      return "Fără owner";
  }
}

function graphicKindOptions() {
  return [
    { value: "", label: "fără tip" },
    { value: "flyer", label: "flyer" },
    { value: "banner-ad", label: "banner-ad" },
    { value: "business-card", label: "business-card" },
    { value: "menu-redesign", label: "menu-redesign" },
    { value: "logo-reinvented", label: "logo-reinvented" },
    { value: "menu", label: "menu" },
  ];
}

function photoOutfitOptions() {
  return [
    { value: "", label: "fără grup" },
    { value: "OUTFIT schimbat cu AI", label: "OUTFIT schimbat cu AI", groupOrder: 0 },
    { value: "OUTFIT REAL", label: "OUTFIT REAL", groupOrder: 10 },
  ];
}

function getSmartSections(items: AdminMediaItem[]) {
  const grouped = new Map<string, AdminMediaItem[]>();

  for (const item of items) {
    let key = "Altele";
    let order = 999;

    if (item.category === "foto" && item.personModel?.name) {
      const label = item.groupLabel?.trim() || "Altele";
      key = label;
      if (label === "OUTFIT schimbat cu AI") order = 0;
      else if (label === "OUTFIT REAL") order = 10;
      else order = item.groupOrder ?? 50;
    } else if (item.category === "grafica") {
      key = item.graphicKind?.trim() || "Alte materiale grafice";
      order = item.groupOrder ?? 50;
    } else {
      key = item.category.toUpperCase();
      order = item.groupOrder ?? 50;
    }

    const bucketKey = `${order}:::${key}`;
    if (!grouped.has(bucketKey)) grouped.set(bucketKey, []);
    grouped.get(bucketKey)!.push(item);
  }

  return [...grouped.entries()]
    .map(([compoundKey, sectionItems]) => {
      const [orderRaw, label] = compoundKey.split(":::");
      return {
        label,
        order: Number(orderRaw),
        items: [...sectionItems].sort((a, b) => {
          const sortDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
          if (sortDiff !== 0) return sortDiff;
          return +new Date(b.date) - +new Date(a.date);
        }),
      };
    })
    .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
}

export default function AdminMediaManager({
  initialItems,
}: AdminMediaManagerClientProps) {
  const [items, setItems] = useState(initialItems);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const groupedFolders = useMemo(() => {
    const ownerTypeOrder: OwnerType[] = ["models", "brands", "audio", "unassigned"];
    const folderMap = new Map<OwnerType, Map<string, AdminMediaItem[]>>();

    for (const item of items) {
      const { ownerType, ownerName } = getOwnerMeta(item);
      if (!folderMap.has(ownerType)) folderMap.set(ownerType, new Map());
      const ownerMap = folderMap.get(ownerType)!;
      if (!ownerMap.has(ownerName)) ownerMap.set(ownerName, []);
      ownerMap.get(ownerName)!.push(item);
    }

    return ownerTypeOrder
      .map((ownerType) => {
        const ownerMap = folderMap.get(ownerType) || new Map<string, AdminMediaItem[]>();
        return {
          ownerType,
          label: ownerTypeLabel(ownerType),
          folders: [...ownerMap.entries()]
            .map(([ownerName, ownerItems]) => ({
              key: `${ownerType}::${ownerName}`,
              ownerName,
              ownerItems: [...ownerItems].sort((a, b) => {
                const categoryDiff = a.category.localeCompare(b.category);
                if (categoryDiff !== 0) return categoryDiff;
                return +new Date(b.date) - +new Date(a.date);
              }),
            }))
            .sort((a, b) => a.ownerName.localeCompare(b.ownerName)),
        };
      })
      .filter((section) => section.folders.length);
  }, [items]);

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
          isVisible: item.isVisible ?? true,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Nu s-a putut salva.");
      }

      setMessage("Fișier actualizat.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscută.");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteItem(item: AdminMediaItem) {
    const confirmed = window.confirm(`Ștergi "${item.title}" din site și baza de date?`);
    if (!confirmed) return;

    setDeletingId(item.id);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/media/${item.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Nu s-a putut șterge.");
      }

      setItems((current) => current.filter((entry) => entry.id !== item.id));
      setMessage("Fișier șters din site și baza de date.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscută.");
    } finally {
      setDeletingId(null);
    }
  }

  function patchItem(id: string, patch: Partial<AdminMediaItem>) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }

  function toggleFolder(key: string) {
    setOpenFolders((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function applyPhotoGroup(item: AdminMediaItem, value: string) {
    const matched = photoOutfitOptions().find((entry) => entry.value === value);
    patchItem(item.id, {
      groupLabel: value,
      groupOrder: matched?.groupOrder ?? 50,
    });
  }

  return (
    <div className="admin-panel-card">
      <div className="admin-card-head">
        <h2>Media manager</h2>
      </div>

      <div className="admin-stack">
        <p className="admin-helper-text">
          Media este grupată pe foldere și poate fi ascunsă de pe site fără delete.
        </p>

        {message ? (
          <p className={message.includes("șters") || message.includes("actualizat") ? "admin-success" : "admin-error"}>
            {message}
          </p>
        ) : null}

        {groupedFolders.map((section) => (
          <div key={section.ownerType} className="admin-folder-section">
            <div className="admin-folder-section-head">
              <h3>{section.label}</h3>
            </div>

            <div className="admin-folder-list">
              {section.folders.map((folder) => {
                const isOpen = !!openFolders[folder.key];
                const folderPreview = getPreview(folder.ownerItems[0]);

                return (
                  <div key={folder.key} className="admin-folder-card">
                    <button
                      type="button"
                      className="admin-folder-toggle"
                      onClick={() => toggleFolder(folder.key)}
                    >
                      <div className="admin-folder-toggle-visual">
                        {folderPreview ? (
                          <img src={folderPreview} alt={folder.ownerName} />
                        ) : (
                          <div className="media-thumb-fallback">FOLDER</div>
                        )}
                      </div>

                      <div className="admin-folder-toggle-copy">
                        <strong>{folder.ownerName}</strong>
                        <span>{folder.ownerItems.length} fișiere</span>
                      </div>

                      <span className="admin-folder-toggle-arrow">{isOpen ? "−" : "+"}</span>
                    </button>

                    {isOpen ? (
                      <div className="admin-folder-open-content">
                        {getSmartSections(folder.ownerItems).map((sectionGroup) => (
                          <div key={`${folder.key}-${sectionGroup.label}`} className="admin-media-subsection">
                            <div className="admin-media-subsection-head">
                              <span>{sectionGroup.label}</span>
                            </div>

                            <div className="admin-list">
                              {sectionGroup.items.map((item) => {
                                const preview = getPreview(item);

                                return (
                                  <div key={item.id} className="admin-list-item admin-list-item-column admin-media-card-modern">
                                    <button
                                      type="button"
                                      className="admin-media-delete-corner"
                                      onClick={() => deleteItem(item)}
                                      disabled={deletingId === item.id}
                                      title="Șterge poza"
                                    >
                                      {deletingId === item.id ? "…" : "×"}
                                    </button>

                                    <div className="admin-media-edit-layout">
                                      <div className="admin-media-edit-preview">
                                        {preview ? (
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
                                          {item.category === "foto" && item.personModel?.name ? (
                                            <div className="admin-form-field">
                                              <label>Outfit</label>
                                              <select
                                                className="admin-select"
                                                value={item.groupLabel || ""}
                                                onChange={(e) => applyPhotoGroup(item, e.target.value)}
                                              >
                                                {photoOutfitOptions().map((option) => (
                                                  <option key={option.value || "empty"} value={option.value}>
                                                    {option.label}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          ) : null}

                                          {item.category === "grafica" ? (
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
                                          ) : null}

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

                                        <label className="admin-checkbox-row">
                                          <input
                                            type="checkbox"
                                            checked={!!item.isVisible}
                                            onChange={(e) => patchItem(item.id, { isVisible: e.target.checked })}
                                          />
                                          <span>Vizibil pe site</span>
                                        </label>

                                        <div className="admin-list-copy">
                                          <span>
                                            {item.category} • {folder.ownerName} • {new Date(item.date).toLocaleDateString("ro-RO")}
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
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {!items.length ? (
          <p className="admin-helper-text">Nu există fișiere pentru editare.</p>
        ) : null}
      </div>
    </div>
  );
}
