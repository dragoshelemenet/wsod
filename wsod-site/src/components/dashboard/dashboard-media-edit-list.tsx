"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardDeleteButton } from "@/components/dashboard/dashboard-delete-button";
import { uploadToSpaces } from "@/lib/uploads/upload-to-spaces";

type OptionItem = {
  id: string;
  name: string;
};

type MediaItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: string;
  description: string | null;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  fileUrl: string | null;
  beforeAiUrl?: string | null;
  isVisible: boolean;
  isFeatured: boolean;
  aiEdited: boolean;
  aiMode?: string | null;
  graphicKind?: string | null;
  videoKind?: string | null;
  videoFormat?: string | null;
  showOnServices?: boolean;
  brandId: string | null;
  personModelId: string | null;
  audioProfileId: string | null;
};

type DashboardMediaEditListProps = {
  items: MediaItem[];
  brands: OptionItem[];
  models: OptionItem[];
  audioProfiles: OptionItem[];
};

const categoryOptions = [
  "all",
  "foto",
  "video",
  "grafica",
  "website",
  "meta-ads",
  "audio",
] as const;

const visibilityOptions = [
  "all",
  "visible",
  "hidden",
  "featured",
  "services",
] as const;

const PAGE_SIZE = 18;


function inferBrandSlugFromUrls(...values: Array<string | null | undefined>) {
  for (const value of values) {
    if (!value) continue;
    const match = value.match(/\/uploads\/([^/]+)\//i);
    if (match?.[1]) return match[1];
  }
  return "";
}


export function DashboardMediaEditList({
  items,
  brands,
  models,
  audioProfiles,
}: DashboardMediaEditListProps) {
  const [message, setMessage] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categoryOptions)[number]>("all");
  const [visibilityFilter, setVisibilityFilter] =
    useState<(typeof visibilityOptions)[number]>("all");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        category === "all" ? true : item.category === category;

      const matchesVisibility =
        visibilityFilter === "all"
          ? true
          : visibilityFilter === "visible"
            ? item.isVisible
            : visibilityFilter === "hidden"
              ? !item.isVisible
              : visibilityFilter === "featured"
                ? item.isFeatured
                : Boolean(item.showOnServices);

      const haystack =
        `${item.title} ${item.slug} ${item.category} ${item.type}`.toLowerCase();

      const matchesQuery = normalizedQuery
        ? haystack.includes(normalizedQuery)
        : true;

      return matchesCategory && matchesVisibility && matchesQuery;
    });
  }, [items, query, category, visibilityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [query, category, visibilityFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, page]);

  const pageIds = paginatedItems.map((item) => item.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

  function toggleSelected(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  }

  function toggleSelectPage() {
    setSelectedIds((current) => {
      if (allPageSelected) {
        return current.filter((id) => !pageIds.includes(id));
      }
      return Array.from(new Set([...current, ...pageIds]));
    });
  }

  async function handleBulkDelete() {
    if (!selectedIds.length) {
      setMessage("Nu ai selectat nimic.");
      return;
    }

    const confirmed = window.confirm(
      `Sigur vrei să ștergi ${selectedIds.length} fișiere?`
    );
    if (!confirmed) return;

    setBulkLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/media/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Nu s-au putut șterge fișierele.");
      }

      setSelectedIds([]);
      setOpenId(null);
      setMessage(data?.message || "Fișierele au fost șterse.");
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscută.");
    } finally {
      setBulkLoading(false);
    }
  }

  if (!items.length) {
    return (
      <div className="empty-state-block">
        <h3>No media yet</h3>
        <p>Nu exista fisiere media in baza de date.</p>
      </div>
    );
  }

  return (
    <div className="admin-stack">
      <div className="media-toolbar media-toolbar-wide">
        <div className="admin-form-field">
          <label htmlFor="media-search">Search</label>
          <input
            id="media-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cauta dupa title sau slug"
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="media-category-filter">Category</label>
          <select
            id="media-category-filter"
            className="admin-select"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as (typeof categoryOptions)[number])
            }
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "Toate" : option}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form-field">
          <label htmlFor="media-visibility-filter">Visibility</label>
          <select
            id="media-visibility-filter"
            className="admin-select"
            value={visibilityFilter}
            onChange={(event) =>
              setVisibilityFilter(
                event.target.value as (typeof visibilityOptions)[number]
              )
            }
          >
            <option value="all">Toate</option>
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
            <option value="featured">Featured</option>
            <option value="services">În Servicii</option>
          </select>
        </div>
      </div>

      <div className="media-pagination-bar">
        <div className="admin-stack" style={{ gap: 8 }}>
          <p className="admin-helper-text">
            {paginatedItems.length} afisate pe pagina • {filteredItems.length} rezultate • {items.length} total
          </p>

          <div className="media-bulk-actions">
            <button
              type="button"
              className="admin-ghost-button"
              onClick={toggleSelectPage}
              disabled={!pageIds.length}
            >
              {allPageSelected ? "Deselectează pagina" : "Selectează pagina"}
            </button>

            <button
              type="button"
              className="admin-ghost-button"
              onClick={() => setSelectedIds([])}
              disabled={!selectedIds.length}
            >
              Clear
            </button>

            <button
              type="button"
              className="admin-delete-button"
              onClick={handleBulkDelete}
              disabled={!selectedIds.length || bulkLoading}
            >
              {bulkLoading ? "Deleting..." : `Delete selected (${selectedIds.length})`}
            </button>
          </div>
        </div>

        <div className="media-pagination-controls">
          <button
            type="button"
            className="admin-ghost-button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
          >
            ‹ Prev
          </button>

          <span className="media-pagination-indicator">
            Pagina {page} / {totalPages}
          </span>

          <button
            type="button"
            className="admin-ghost-button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
          >
            Next ›
          </button>
        </div>
      </div>

      <div className="admin-list compact-admin-list">
        {paginatedItems.map((item) => (
          <DashboardMediaEditCard
            key={item.id}
            item={item}
            brands={brands}
            models={models}
            audioProfiles={audioProfiles}
            onMessage={setMessage}
            isOpen={openId === item.id}
            isSelected={selectedIds.includes(item.id)}
            onToggleSelected={() => toggleSelected(item.id)}
            onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
          />
        ))}
      </div>

      <div className="media-pagination-bar media-pagination-bottom">
        <div className="media-pagination-controls">
          <button
            type="button"
            className="admin-ghost-button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
          >
            ‹ Prev
          </button>

          <span className="media-pagination-indicator">
            Pagina {page} / {totalPages}
          </span>

          <button
            type="button"
            className="admin-ghost-button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
          >
            Next ›
          </button>
        </div>
      </div>

      {message ? <p className="admin-helper-text">{message}</p> : null}
    </div>
  );
}

function DashboardMediaEditCard({
  item,
  brands,
  models,
  audioProfiles,
  onMessage,
  isOpen,
  isSelected,
  onToggleSelected,
  onToggle,
}: {
  item: MediaItem;
  brands: OptionItem[];
  models: OptionItem[];
  audioProfiles: OptionItem[];
  onMessage: (value: string) => void;
  isOpen: boolean;
  isSelected: boolean;
  onToggleSelected: () => void;
  onToggle: () => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [slug, setSlug] = useState(item.slug);
  const [description, setDescription] = useState(item.description || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(item.thumbnailUrl || "");
  const [previewUrl, setPreviewUrl] = useState(item.previewUrl || "");
  const [fileUrl, setFileUrl] = useState(item.fileUrl || "");
  const [beforeAiUrl, setBeforeAiUrl] = useState(item.beforeAiUrl || "");
  const [brandId, setBrandId] = useState(item.brandId || "");
  const [personModelId, setPersonModelId] = useState(item.personModelId || "");
  const [audioProfileId, setAudioProfileId] = useState(item.audioProfileId || "");
  const [isVisible, setIsVisible] = useState(item.isVisible);
  const [isFeatured, setIsFeatured] = useState(item.isFeatured);
  const [aiMode, setAiMode] = useState(item.aiMode || "");
  const [graphicKind, setGraphicKind] = useState(item.graphicKind || "");
  const [videoKind, setVideoKind] = useState(item.videoKind || "");
  const [videoFormat, setVideoFormat] = useState(item.videoFormat || "portrait-9x16");
  const [showOnServices, setShowOnServices] = useState(Boolean(item.showOnServices));
  const [thumbnailDragOver, setThumbnailDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  const previewImage = useMemo(
    () => thumbnailUrl || previewUrl || fileUrl || "",
    [thumbnailUrl, previewUrl, fileUrl]
  );

  async function handleThumbnailUpload(file: File) {
    const brandSlug = inferBrandSlugFromUrls(fileUrl, thumbnailUrl, previewUrl);

    if (!brandSlug) {
      onMessage("Nu pot determina brand slug pentru upload thumbnail.");
      return;
    }

    try {
      setLoading(true);
      onMessage("");
      const uploaded = await uploadToSpaces({
        file,
        brandSlug,
        category: "video",
      });
      setThumbnailUrl(uploaded.url);
      onMessage("Thumbnail uploadat cu succes.");
    } catch (error) {
      onMessage(error instanceof Error ? error.message : "Eroare upload thumbnail.");
    } finally {
      setLoading(false);
    }
  }


  async function handleBeforeAiUpload(file: File) {
    const brandSlug = inferBrandSlugFromUrls(fileUrl, thumbnailUrl, previewUrl, beforeAiUrl);

    if (!brandSlug) {
      onMessage("Nu pot determina owner slug pentru upload before AI.");
      return;
    }

    try {
      setLoading(true);
      onMessage("");
      const uploaded = await uploadToSpaces({
        file,
        brandSlug,
        category: "foto",
      });
      setBeforeAiUrl(uploaded.url);
      onMessage("Imaginea before AI a fost uploadată.");
    } catch (error) {
      onMessage(error instanceof Error ? error.message : "Eroare upload before AI.");
    } finally {
      setLoading(false);
    }
  }

  async function onSave() {
    setLoading(true);
    onMessage("");

    try {
      const response = await fetch(`/api/admin/media/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          description,
          thumbnailUrl,
          previewUrl,
          fileUrl,
          beforeAiUrl,
          brandId: brandId || null,
          personModelId: personModelId || null,
          audioProfileId: audioProfileId || null,
          isVisible,
          isFeatured,
          aiEdited: !!aiMode,
          aiMode,
          graphicKind: item.category === "grafica" ? (graphicKind || null) : null,
          showOnServices: item.category === "grafica" ? showOnServices : false,
          videoKind: item.category === "video" ? (videoKind || null) : null,
          videoFormat: item.category === "video" ? videoFormat : null,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Nu s-a putut salva media item.");
      }

      onMessage(`Salvat: ${title}`);
    } catch (error) {
      onMessage(error instanceof Error ? error.message : "Eroare necunoscuta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className={`admin-list-item media-compact-card ${isOpen ? "is-open" : ""}`}>
      <button
        type="button"
        className="media-compact-head"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="media-compact-left">
          <label
            className="media-select-checkbox"
            onClick={(event) => event.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelected}
            />
          </label>

          <div className="media-compact-thumb">
            {previewImage ? <img src={previewImage} alt={title} /> : null}
          </div>

          <div className="media-compact-meta">
            <strong>{title}</strong>
            <span>{item.category} • {item.type}{item.category === "grafica" && graphicKind ? ` • ${graphicKind}` : ""}{item.category === "video" && videoKind === "lyrics" ? " • lyrics" : ""}{item.category === "video" ? ` • ${videoFormat === "wide-16x9" ? "16:9" : videoFormat === "square-1x1" ? "1:1" : "9:16"}` : ""}</span>
            <span>{item.slug}</span>
            <span>
              {isVisible ? "Visible" : "Hidden"} • {isFeatured ? "Featured" : "Normal"}{item.category === "grafica" && item.showOnServices ? " • Servicii" : ""} • {aiMode ? aiMode.toUpperCase() : "No AI"}
            </span>
          </div>
        </div>

        <div className="media-compact-right">
          <span className="admin-ghost-button">{isOpen ? "Close" : "Edit"}</span>
        </div>
      </button>

      {isOpen ? (
        <div className="media-compact-editor">
          <div className="admin-grid-two">
            <div className="admin-form-field">
              <label>Title</label>
              <input value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>

            <div className="admin-form-field">
              <label>Slug</label>
              <input value={slug} onChange={(event) => setSlug(event.target.value)} />
            </div>

            <div className="admin-form-field admin-grid-full">
              <label>Description</label>
              <textarea
                className="admin-textarea"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="admin-form-field">
              <label>Thumbnail URL</label>
              <input
                value={thumbnailUrl}
                onChange={(event) => setThumbnailUrl(event.target.value)}
              />
            </div>

            {item.category === "video" ? (
              <div className="admin-form-field">
                <label>Upload thumbnail video</label>
                <div
                  className={`admin-dropzone admin-dropzone-compact ${thumbnailDragOver ? "is-dragover" : ""}`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setThumbnailDragOver(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    setThumbnailDragOver(false);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    setThumbnailDragOver(false);
                    const file = event.dataTransfer.files?.[0];
                    if (file) {
                      void handleThumbnailUpload(file);
                    }
                  }}
                >
                  <input
                    className="admin-dropzone-input"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        void handleThumbnailUpload(file);
                      }
                      event.currentTarget.value = "";
                    }}
                  />
                  <div className="admin-dropzone-copy">
                    <strong>Drag & drop thumbnail aici</strong>
                    <span>sau click pentru imagine nouă</span>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="admin-form-field">
              <label>Preview URL</label>
              <input
                value={previewUrl}
                onChange={(event) => setPreviewUrl(event.target.value)}
              />
            </div>

            <div className="admin-form-field admin-grid-full">
              <label>File URL</label>
              <input value={fileUrl} onChange={(event) => setFileUrl(event.target.value)} />
            </div>

            <div className="admin-form-field">
              <label>Brand</label>
              <select
                className="admin-select"
                value={brandId}
                onChange={(event) => setBrandId(event.target.value)}
              >
                <option value="">No brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-field">
              <label>Model</label>
              <select
                className="admin-select"
                value={personModelId}
                onChange={(event) => setPersonModelId(event.target.value)}
              >
                <option value="">No model</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            {["audio", "video"].includes(item.category) ? (
              <div className="admin-form-field">
                <label>Audio Profile</label>
                <select
                  className="admin-select"
                  value={audioProfileId}
                  onChange={(event) => setAudioProfileId(event.target.value)}
                >
                  <option value="">No audio profile</option>
                  {audioProfiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div className="admin-grid-full admin-inline-toggles">
              <label className="admin-toggle-row">
                <span>Visible</span>
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={(event) => setIsVisible(event.target.checked)}
                />
              </label>

              <label className="admin-toggle-row">
                <span>Featured</span>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(event) => setIsFeatured(event.target.checked)}
                />
              </label>

              {item.category === "grafica" ? (
                <>
                  <div className="admin-form-field">
                    <label>Tip material grafic</label>
                    <select
                      className="admin-select"
                      value={graphicKind}
                      onChange={(event) => setGraphicKind(event.target.value)}
                    >
                      <option value="">Selectează tipul</option>
                      <option value="flyer">Flyer</option>
                      <option value="carte-vizita">Carte de vizita</option>
                      <option value="certificat">Certificat</option>
                      <option value="poster">Poster</option>
                      <option value="banner">Banner</option>
                      <option value="meniu">Meniu</option>
                      <option value="ambalaj">Ambalaj</option>
                      <option value="eticheta">Eticheta</option>
                      <option value="social-media">Social media</option>
                      <option value="logo">Logo</option>
                      <option value="altul">Altul</option>
                    </select>
                  </div>

                  <label className="admin-toggle-row">
                    <span>Arată și în Servicii</span>
                    <input
                      type="checkbox"
                      checked={showOnServices}
                      onChange={(event) => setShowOnServices(event.target.checked)}
                    />
                  </label>
                </>
              ) : null}

              {["foto", "video"].includes(item.category) ? (
                <div className="admin-form-field">
                  <label>AI tag</label>
                  <select
                    className="admin-select"
                    value={aiMode}
                    onChange={(event) => setAiMode(event.target.value)}
                  >
                    <option value="">Fără AI tag</option>
                    <option value="ai">AI</option>
                    {item.category === "foto" ? <option value="ai-edit">AI EDIT</option> : null}
                    {item.category === "foto" ? <option value="ai-enhanced">AI ÎMBUNĂTĂȚIT</option> : null}
                  </select>
                </div>
              ) : null}

              {item.category === "foto" && aiMode ? (
                <>
                  <div className="admin-form-field admin-grid-full">
                    <label>Before AI URL</label>
                    <input
                      value={beforeAiUrl}
                      onChange={(event) => setBeforeAiUrl(event.target.value)}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="admin-form-field">
                    <label>Upload imagine before AI</label>
                    <div className="admin-dropzone admin-dropzone-compact">
                      <input
                        className="admin-dropzone-input"
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) {
                            void handleBeforeAiUpload(file);
                          }
                          event.currentTarget.value = "";
                        }}
                      />
                      <div className="admin-dropzone-copy">
                        <strong>{beforeAiUrl ? "Before AI încărcat" : "Încarcă imaginea before AI"}</strong>
                        <span>toggle-ul din slug apare doar dacă această imagine există</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}

              {item.category === "video" ? (
                <>
                  <div className="admin-form-field">
                    <label>Tip video</label>
                    <select
                      className="admin-select"
                      value={videoKind}
                      onChange={(event) => setVideoKind(event.target.value)}
                    >
                      <option value="">Video normal</option>
                      <option value="lyrics">Videoclip cu versuri</option>
                    </select>
                  </div>

                  <div className="admin-form-field">
                    <label>Format video</label>
                    <select
                      className="admin-select"
                      value={videoFormat}
                      onChange={(event) => setVideoFormat(event.target.value)}
                    >
                      <option value="portrait-9x16">9:16</option>
                      <option value="wide-16x9">16:9</option>
                      <option value="square-1x1">1:1</option>
                    </select>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className="site-content-actions">
            <button className="admin-submit" type="button" onClick={onSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>

            <DashboardDeleteButton
              endpoint={`/api/admin/media/${item.id}`}
              label={title}
            />
          </div>
        </div>
      ) : null}
    </article>
  );
}
