"use client";

import { useState } from "react";

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  hoverPreview1?: string | null;
  hoverPreview2?: string | null;
  hoverPreview3?: string | null;
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

  const { publicUrl, objectKey, uploadUrl } = (await presignResponse.json()) as {
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

  async function saveBrand(
    brand: BrandItem,
    files?: {
      logoFile?: File | null;
      hoverPreview1File?: File | null;
      hoverPreview2File?: File | null;
      hoverPreview3File?: File | null;
    }
  ) {
    setSavingId(brand.id);
    setMessage("");

    try {
      let finalLogoUrl = brand.logoUrl || "";
      let finalHoverPreview1 = brand.hoverPreview1 || "";
      let finalHoverPreview2 = brand.hoverPreview2 || "";
      let finalHoverPreview3 = brand.hoverPreview3 || "";

      if (files?.logoFile) {
        const uploaded = await presignAndUploadFile(files.logoFile, brand.slug, "brand-logo");
        finalLogoUrl = uploaded.publicUrl;
      }

      if (files?.hoverPreview1File) {
        const uploaded = await presignAndUploadFile(
          files.hoverPreview1File,
          brand.slug,
          "brand-hover-preview-1"
        );
        finalHoverPreview1 = uploaded.publicUrl;
      }

      if (files?.hoverPreview2File) {
        const uploaded = await presignAndUploadFile(
          files.hoverPreview2File,
          brand.slug,
          "brand-hover-preview-2"
        );
        finalHoverPreview2 = uploaded.publicUrl;
      }

      if (files?.hoverPreview3File) {
        const uploaded = await presignAndUploadFile(
          files.hoverPreview3File,
          brand.slug,
          "brand-hover-preview-3"
        );
        finalHoverPreview3 = uploaded.publicUrl;
      }

      const response = await fetch(`/api/admin/brands/${brand.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: brand.name,
          slug: brand.slug,
          logoUrl: finalLogoUrl,
          coverImageUrl: "",
          hoverPreview1: finalHoverPreview1,
          hoverPreview2: finalHoverPreview2,
          hoverPreview3: finalHoverPreview3,
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

      patchBrand(brand.id, {
        logoUrl: finalLogoUrl,
        hoverPreview1: finalHoverPreview1,
        hoverPreview2: finalHoverPreview2,
        hoverPreview3: finalHoverPreview3,
      });

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
          Folderul arată logo/imagine normal, iar pe hover folosește cele 3 preview-uri statice.
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
  onSave: (
    brand: BrandItem,
    files?: {
      logoFile?: File | null;
      hoverPreview1File?: File | null;
      hoverPreview2File?: File | null;
      hoverPreview3File?: File | null;
    }
  ) => Promise<void>;
  onDelete: (brand: BrandItem) => Promise<void>;
  isSaving: boolean;
  isDeleting: boolean;
}) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [hoverPreview1File, setHoverPreview1File] = useState<File | null>(null);
  const [hoverPreview2File, setHoverPreview2File] = useState<File | null>(null);
  const [hoverPreview3File, setHoverPreview3File] = useState<File | null>(null);

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
            <label>Înlocuiește logo / imagine folder</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="admin-form-field">
            <label>Hover preview 1</label>
            <input
              value={brand.hoverPreview1 || ""}
              onChange={(e) => onPatch({ hoverPreview1: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setHoverPreview1File(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="admin-form-field">
            <label>Hover preview 2</label>
            <input
              value={brand.hoverPreview2 || ""}
              onChange={(e) => onPatch({ hoverPreview2: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setHoverPreview2File(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="admin-form-field">
            <label>Hover preview 3</label>
            <input
              value={brand.hoverPreview3 || ""}
              onChange={(e) => onPatch({ hoverPreview3: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setHoverPreview3File(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="admin-inline-actions">
            <button
              type="button"
              className="admin-danger-button"
              onClick={() =>
                onPatch({
                  logoUrl: "",
                  coverImageUrl: "",
                  hoverPreview1: "",
                  hoverPreview2: "",
                  hoverPreview3: "",
                })
              }
            >
              Șterge imaginile
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
              onClick={() =>
                onSave(brand, {
                  logoFile,
                  hoverPreview1File,
                  hoverPreview2File,
                  hoverPreview3File,
                })
              }
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
