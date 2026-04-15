"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DashboardBrandFormProps = {
  mode?: "create" | "edit";
  brand?: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
    coverImageUrl?: string | null;
    description?: string | null;
    isVisible?: boolean;
  } | null;
  onDone?: () => void;
};

export function DashboardBrandForm({
  mode = "create",
  brand = null,
  onDone,
}: DashboardBrandFormProps) {
  const router = useRouter();

  const [name, setName] = useState(brand?.name || "");
  const [slug, setSlug] = useState(brand?.slug || "");
  const [logoUrl, setLogoUrl] = useState(brand?.logoUrl || "");
  const [coverImageUrl, setCoverImageUrl] = useState(brand?.coverImageUrl || "");
  const [description, setDescription] = useState(brand?.description || "");
  const [isVisible, setIsVisible] = useState(brand?.isVisible ?? true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const isEdit = mode === "edit" && brand?.id;
      const url = isEdit ? `/api/admin/brands/${brand.id}` : "/api/admin/brands";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          logoUrl,
          coverImageUrl,
          description,
          isVisible,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.error ||
            (isEdit ? "Nu s-a putut actualiza brandul." : "Nu s-a putut crea brandul.")
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
      setMessage(error instanceof Error ? error.message : "Eroare necunoscuta.");
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
          <label htmlFor={`brand-name-${brand?.id || "new"}`}>Name</label>
          <input
            id={`brand-name-${brand?.id || "new"}`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Brand name"
            required
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor={`brand-slug-${brand?.id || "new"}`}>Slug</label>
          <input
            id={`brand-slug-${brand?.id || "new"}`}
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="brand-slug"
            required
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor={`brand-logo-${brand?.id || "new"}`}>Logo URL</label>
          <input
            id={`brand-logo-${brand?.id || "new"}`}
            value={logoUrl}
            onChange={(event) => setLogoUrl(event.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor={`brand-cover-${brand?.id || "new"}`}>Cover image URL</label>
          <input
            id={`brand-cover-${brand?.id || "new"}`}
            value={coverImageUrl}
            onChange={(event) => setCoverImageUrl(event.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor={`brand-description-${brand?.id || "new"}`}>Description</label>
          <textarea
            id={`brand-description-${brand?.id || "new"}`}
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
          <button className="admin-submit" type="submit" disabled={loading}>
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
