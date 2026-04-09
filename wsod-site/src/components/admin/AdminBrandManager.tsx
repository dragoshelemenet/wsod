"use client";

import { useState } from "react";

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  description?: string | null;
  seoTitle?: string | null;
  metaDescription?: string | null;
  isVisible?: boolean;
}

interface Props {
  initialBrands: BrandItem[];
}

async function presignAndUploadFile(file: File, brandSlug: string, category: string) {
  const presignResponse = await fetch("/api/uploads/presign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      brandSlug,
      category,
    }),
  });

  if (!presignResponse.ok) {
    throw new Error("Nu s-a putut genera URL-ul de upload.");
  }

  const { uploadUrl, publicUrl, objectKey } = (await presignResponse.json()) as {
    uploadUrl: string;
    publicUrl: string;
    objectKey: string;
  };

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Upload-ul imaginii către Spaces a eșuat.");
  }

  const makePublicResponse = await fetch("/api/uploads/make-public", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      objectKey,
    }),
  });

  if (!makePublicResponse.ok) {
    throw new Error("Imaginea a fost urcată, dar nu a putut fi făcută publică.");
  }

  return { publicUrl };
}

export default function AdminBrandManager({ initialBrands }: Props) {
  const [brands, setBrands] = useState(initialBrands);
  const [message, setMessage] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function patchBrand(id: string, patch: Partial<BrandItem>) {
    setBrands((current) =>
      current.map((brand) => (brand.id === id ? { ...brand, ...patch } : brand))
    );
  }

  async function saveBrand(brand: BrandItem, logoFile?: File | null, coverFile?: File | null) {
    setSavingId(brand.id);
    setMessage("");

    try {
      let finalLogoUrl = brand.logoUrl || "";
      let finalCoverImageUrl = brand.coverImageUrl || "";

      if (logoFile) {
        const uploadedLogo = await presignAndUploadFile(logoFile, brand.slug, "brand-logo");
        finalLogoUrl = uploadedLogo.publicUrl;
        patchBrand(brand.id, { logoUrl: finalLogoUrl });
      }

      if (coverFile) {
        const uploadedCover = await presignAndUploadFile(coverFile, brand.slug, "brand-cover");
        finalCoverImageUrl = uploadedCover.publicUrl;
        patchBrand(brand.id, { coverImageUrl: finalCoverImageUrl });
      }

      const response = await fetch(`/api/admin/brands/${brand.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: brand.name,
          slug: brand.slug,
          logoUrl: finalLogoUrl,
          coverImageUrl: finalCoverImageUrl,
          description: brand.description || "",
          seoTitle: brand.seoTitle || "",
          metaDescription: brand.metaDescription || "",
          isVisible: !!brand.isVisible,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Nu s-a putut salva brandul.");
      }

      setMessage("Brand actualizat.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscută.");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteBrand(brand: BrandItem) {
    const confirmed = window.confirm(`Ștergi brandul "${brand.name}"?`);
    if (!confirmed) return;

    setDeletingId(brand.id);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/brands/${brand.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Nu s-a putut șterge brandul.");
      }

      setBrands((current) => current.filter((item) => item.id !== brand.id));
      setMessage("Brand șters.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscută.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="admin-panel-card">
      <div className="admin-card-head">
        <h2>Administrare branduri</h2>
      </div>

      <div className="admin-stack">
        <p className="admin-helper-text">
          Poți edita slugul, descrierea, SEO, visibility și poți înlocui sau șterge imaginile brandului.
        </p>

        {message ? (
          <p className={message.includes("actualizat") || message.includes("șters") ? "admin-success" : "admin-error"}>
            {message}
          </p>
        ) : null}

        <div className="admin-list">
          {brands.map((brand) => (
            <BrandEditorCard
              key={brand.id}
              brand={brand}
              onPatch={(patch) => patchBrand(brand.id, patch)}
              onSave={saveBrand}
              onDelete={deleteBrand}
              isSaving={savingId === brand.id}
              isDeleting={deletingId === brand.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BrandEditorCard({
  brand,
  onPatch,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}: {
  brand: BrandItem;
  onPatch: (patch: Partial<BrandItem>) => void;
  onSave: (brand: BrandItem, logoFile?: File | null, coverFile?: File | null) => Promise<void>;
  onDelete: (brand: BrandItem) => Promise<void>;
  isSaving: boolean;
  isDeleting: boolean;
}) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  return (
    <div className="admin-list-item admin-list-item-column">
      <div className="admin-media-edit-layout">
        <div className="admin-media-edit-preview">
          {brand.logoUrl ? <img src={brand.logoUrl} alt={brand.name} /> : <div className="media-thumb-fallback">LOGO</div>}
        </div>

        <div className="admin-media-edit-form">
          <div className="admin-form-field">
            <label>Nume brand</label>
            <input
              value={brand.name}
              onChange={(e) => onPatch({ name: e.target.value })}
            />
          </div>

          <div className="admin-form-field">
            <label>Slug</label>
            <input
              value={brand.slug}
              onChange={(e) => onPatch({ slug: e.target.value })}
            />
          </div>

          <div className="admin-form-field">
            <label>Descriere</label>
            <textarea
              rows={3}
              value={brand.description || ""}
              onChange={(e) => onPatch({ description: e.target.value })}
            />
          </div>

          <div className="admin-form-field">
            <label>SEO title</label>
            <input
              value={brand.seoTitle || ""}
              onChange={(e) => onPatch({ seoTitle: e.target.value })}
            />
          </div>

          <div className="admin-form-field">
            <label>Meta description</label>
            <textarea
              rows={3}
              value={brand.metaDescription || ""}
              onChange={(e) => onPatch({ metaDescription: e.target.value })}
            />
          </div>

          <div className="admin-form-field">
            <label>Logo URL</label>
            <input
              value={brand.logoUrl || ""}
              onChange={(e) => onPatch({ logoUrl: e.target.value })}
            />
          </div>

          <div className="admin-form-field">
            <label>Înlocuiește logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="admin-inline-actions">
            <button
              type="button"
              className="admin-danger-button"
              onClick={() => onPatch({ logoUrl: "" })}
            >
              Șterge logo
            </button>
          </div>

          <div className="admin-form-field">
            <label>Cover image URL</label>
            <input
              value={brand.coverImageUrl || ""}
              onChange={(e) => onPatch({ coverImageUrl: e.target.value })}
            />
          </div>

          <div className="admin-form-field">
            <label>Înlocuiește cover</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="admin-inline-actions">
            <button
              type="button"
              className="admin-danger-button"
              onClick={() => onPatch({ coverImageUrl: "" })}
            >
              Șterge cover
            </button>
          </div>

          <label className="admin-checkbox-row">
            <input
              type="checkbox"
              checked={!!brand.isVisible}
              onChange={(e) => onPatch({ isVisible: e.target.checked })}
            />
            <span>Vizibil pe site</span>
          </label>

          <div className="admin-inline-actions">
            <button
              type="button"
              className="admin-submit"
              onClick={() => onSave(brand, logoFile, coverFile)}
              disabled={isSaving}
            >
              {isSaving ? "Se salvează..." : "Salvează brand"}
            </button>

            <button
              type="button"
              className="admin-danger-button"
              onClick={() => onDelete(brand)}
              disabled={isDeleting}
            >
              {isDeleting ? "Se șterge..." : "Șterge brand"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
