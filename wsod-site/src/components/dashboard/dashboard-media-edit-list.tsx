"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardDeleteButton } from "@/components/dashboard/dashboard-delete-button";

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
  isVisible: boolean;
  isFeatured: boolean;
  aiEdited: boolean;
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
] as const;

const PAGE_SIZE = 18;

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
              : item.isFeatured;

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
          </select>
        </div>
      </div>

      <div className="media-pagination-bar">
        <p className="admin-helper-text">
          {paginatedItems.length} afisate pe pagina • {filteredItems.length} rezultate • {items.length} total
        </p>

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
  onToggle,
}: {
  item: MediaItem;
  brands: OptionItem[];
  models: OptionItem[];
  audioProfiles: OptionItem[];
  onMessage: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [slug, setSlug] = useState(item.slug);
  const [description, setDescription] = useState(item.description || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(item.thumbnailUrl || "");
  const [previewUrl, setPreviewUrl] = useState(item.previewUrl || "");
  const [fileUrl, setFileUrl] = useState(item.fileUrl || "");
  const [brandId, setBrandId] = useState(item.brandId || "");
  const [personModelId, setPersonModelId] = useState(item.personModelId || "");
  const [audioProfileId, setAudioProfileId] = useState(item.audioProfileId || "");
  const [isVisible, setIsVisible] = useState(item.isVisible);
  const [isFeatured, setIsFeatured] = useState(item.isFeatured);
  const [aiEdited, setAiEdited] = useState(item.aiEdited);
  const [loading, setLoading] = useState(false);

  const previewImage = useMemo(
    () => thumbnailUrl || previewUrl || fileUrl || "",
    [thumbnailUrl, previewUrl, fileUrl]
  );

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
          brandId: brandId || null,
          personModelId: personModelId || null,
          audioProfileId: audioProfileId || null,
          isVisible,
          isFeatured,
          aiEdited,
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
          <div className="media-compact-thumb">
            {previewImage ? <img src={previewImage} alt={title} /> : null}
          </div>

          <div className="media-compact-meta">
            <strong>{title}</strong>
            <span>{item.category} • {item.type}</span>
            <span>{item.slug}</span>
            <span>
              {isVisible ? "Visible" : "Hidden"} • {isFeatured ? "Featured" : "Normal"} • {aiEdited ? "AI" : "No AI"}
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

              <label className="admin-toggle-row">
                <span>Schimbat cu AI</span>
                <input
                  type="checkbox"
                  checked={aiEdited}
                  onChange={(event) => setAiEdited(event.target.checked)}
                />
              </label>
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
