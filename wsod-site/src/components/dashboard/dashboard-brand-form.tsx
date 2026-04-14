"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type DashboardBrandFormProps = {
  brand?: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
    coverImageUrl?: string | null;
    description?: string | null;
    isVisible?: boolean;
  } | null;
  mode?: "create" | "edit";
  onDone?: () => void;
};

export function DashboardBrandForm({
  brand = null,
  mode = "create",
  onDone,
}: DashboardBrandFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(brand?.name || "");
  const [slug, setSlug] = useState(brand?.slug || "");
  const [logoUrl, setLogoUrl] = useState(brand?.logoUrl || "");
  const [coverImageUrl, setCoverImageUrl] = useState(brand?.coverImageUrl || "");
  const [description, setDescription] = useState(brand?.description || "");
  const [isVisible, setIsVisible] = useState(brand?.isVisible ?? true);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setMessage("");

    try {
      const response = await fetch("/api/studio/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Upload failed");
      }

      setLogoUrl(data.url || "");
      setMessage("Logo uploaded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    uploadFile(file);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        name,
        slug,
        logoUrl,
        coverImageUrl,
        description,
        isVisible,
      };

      const response =
        mode === "edit" && brand?.id
          ? await fetch(`/api/admin/brands/${brand.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          : await fetch("/api/admin/brands", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.error ||
            (mode === "edit"
              ? "Nu s-a putut actualiza brandul."
              : "Nu s-a putut crea brandul.")
        );
      }

      if (mode === "create") {
        setName("");
        setSlug("");
        setLogoUrl("");
        setCoverImageUrl("");
        setDescription("");
        setIsVisible(true);
        setMessage("Brand creat cu succes.");
      } else {
        setMessage("Brand actualizat cu succes.");
      }

      router.refresh();
      onDone?.();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscută.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <div className="admin-card-head">
        <h2>{mode === "edit" ? "Edit brand" : "Create brand"}</h2>
      </div>

      <div className="admin-stack">
        <div className="admin-form-field">
          <label htmlFor={`brand-name-${mode}-${brand?.id || "new"}`}>Name</label>
          <input
            id={`brand-name-${mode}-${brand?.id || "new"}`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Brand name"
            required
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor={`brand-slug-${mode}-${brand?.id || "new"}`}>Slug</label>
          <input
            id={`brand-slug-${mode}-${brand?.id || "new"}`}
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="brand-slug"
            required
          />
        </div>

        <div className="admin-form-field">
          <label>Logo image</label>

          <div
            className="admin-dropzone"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onDrop={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleFiles(event.dataTransfer.files);
            }}
          >
            <input
              ref={fileInputRef}
              className="admin-dropzone-input"
              type="file"
              accept="image/*"
              onChange={(event) => handleFiles(event.target.files)}
            />

            <div className="admin-dropzone-copy">
              <strong>{uploading ? "Uploading..." : "Drag & drop logo here"}</strong>
              <span>or click to choose file</span>
            </div>
          </div>
        </div>

        <div className="admin-form-field">
          <label htmlFor={`brand-logo-${mode}-${brand?.id || "new"}`}>Logo URL</label>
          <input
            id={`brand-logo-${mode}-${brand?.id || "new"}`}
            value={logoUrl}
            onChange={(event) => setLogoUrl(event.target.value)}
            placeholder="/uploads/brands/..."
          />
        </div>

        {logoUrl ? (
          <div
            style={{
              width: "220px",
              maxWidth: "100%",
              padding: "12px",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <img
              src={logoUrl}
              alt={name || "Brand logo"}
              style={{
                width: "100%",
                maxHeight: "120px",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
        ) : null}

        <div className="admin-form-field">
          <label htmlFor={`brand-cover-${mode}-${brand?.id || "new"}`}>Cover image URL</label>
          <input
            id={`brand-cover-${mode}-${brand?.id || "new"}`}
            value={coverImageUrl}
            onChange={(event) => setCoverImageUrl(event.target.value)}
            placeholder="/uploads/brands/cover..."
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor={`brand-description-${mode}-${brand?.id || "new"}`}>Description</label>
          <textarea
            id={`brand-description-${mode}-${brand?.id || "new"}`}
            className="admin-textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Descriere brand"
          />
        </div>

        <label className="admin-toggle-row">
          <span>Visible</span>
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(event) => setIsVisible(event.target.checked)}
          />
        </label>

        <div className="site-content-actions">
          <button className="admin-submit" type="submit" disabled={loading || uploading}>
            {loading
              ? mode === "edit"
                ? "Saving..."
                : "Creating..."
              : mode === "edit"
                ? "Save changes"
                : "Create brand"}
          </button>
        </div>

        {message ? <p className="admin-helper-text">{message}</p> : null}
      </div>
    </form>
  );
}