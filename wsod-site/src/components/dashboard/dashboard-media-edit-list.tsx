"use client";

import { useMemo, useState } from "react";

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

export function DashboardMediaEditList({
  items,
  brands,
  models,
  audioProfiles,
}: DashboardMediaEditListProps) {
  const [message, setMessage] = useState("");

  if (!items.length) {
    return (
      <div className="empty-state-block">
        <h3>No media yet</h3>
        <p>Nu exista fisiere media in baza de date.</p>
      </div>
    );
  }

  return (
    <div className="admin-list">
      {items.map((item) => (
        <DashboardMediaEditCard
          key={item.id}
          item={item}
          brands={brands}
          models={models}
          audioProfiles={audioProfiles}
          onMessage={setMessage}
        />
      ))}

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
}: {
  item: MediaItem;
  brands: OptionItem[];
  models: OptionItem[];
  audioProfiles: OptionItem[];
  onMessage: (value: string) => void;
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
    <article className="admin-list-item">
      <div className="admin-list-copy" style={{ gap: 12 }}>
        <strong>{item.title}</strong>

        <div className="admin-form-field">
          <label>Title</label>
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </div>

        <div className="admin-form-field">
          <label>Slug</label>
          <input value={slug} onChange={(event) => setSlug(event.target.value)} />
        </div>

        <div className="admin-form-field">
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

        <div className="admin-form-field">
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

        <div className="site-content-actions">
          <button className="admin-submit" type="button" onClick={onSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="admin-folder-toggle-visual">
        {previewImage ? <img src={previewImage} alt={title} /> : null}
      </div>
    </article>
  );
}
