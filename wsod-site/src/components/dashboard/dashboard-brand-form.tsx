"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

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

type UploadKind = "logo" | "cover";

type PresignResponse = {
  uploadUrl?: string;
  publicUrl?: string;
  fileUrl?: string;
  objectKey?: string;
  error?: string;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function DashboardBrandForm({
  mode = "create",
  brand = null,
  onDone,
}: DashboardBrandFormProps) {
  const router = useRouter();

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(brand?.name || "");
  const [slug, setSlug] = useState(brand?.slug || "");
  const [logoUrl, setLogoUrl] = useState(brand?.logoUrl || "");
  const [coverImageUrl, setCoverImageUrl] = useState(brand?.coverImageUrl || "");
  const [description, setDescription] = useState(brand?.description || "");
  const [isVisible, setIsVisible] = useState(brand?.isVisible ?? true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [dragLogo, setDragLogo] = useState(false);
  const [dragCover, setDragCover] = useState(false);

  async function uploadImage(file: File, kind: UploadKind) {
    if (!file.type.startsWith("image/")) {
      throw new Error("Poți urca doar imagini.");
    }

    if (kind === "logo") setUploadingLogo(true);
    if (kind === "cover") setUploadingCover(true);

    try {
      const brandSlug = slugify(slug || name || brand?.slug || brand?.name || "brand");

      const presignResponse = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
          brandSlug,
          category: kind === "logo" ? "brand-logo" : "brand-cover",
        }),
      });

      const presignData: PresignResponse = await presignResponse.json().catch(() => ({}));

      if (!presignResponse.ok) {
        throw new Error(presignData?.error || "Nu s-a putut genera linkul de upload.");
      }

      const uploadUrl = presignData.uploadUrl;
      const finalUrl = presignData.fileUrl || presignData.publicUrl || "";
      const objectKey = presignData.objectKey || "";

      if (!uploadUrl || !finalUrl || !objectKey) {
        throw new Error("Răspuns invalid de la presign endpoint.");
      }

      const uploadResult = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (!uploadResult.ok) {
        throw new Error("Upload-ul imaginii a eșuat.");
      }

      const publicResponse = await fetch("/api/uploads/make-public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          objectKey,
        }),
      });

      const publicData = await publicResponse.json().catch(() => ({}));

      if (!publicResponse.ok) {
        throw new Error(publicData?.error || "Imaginea a fost urcată, dar nu a putut fi făcută publică.");
      }

      if (kind === "logo") setLogoUrl(finalUrl);
      if (kind === "cover") setCoverImageUrl(finalUrl);
    } finally {
      if (kind === "logo") setUploadingLogo(false);
      if (kind === "cover") setUploadingCover(false);
    }
  }

  async function onFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
    kind: UploadKind
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadImage(file, kind);
      setMessage(kind === "logo" ? "Logo urcat cu succes." : "Cover urcat cu succes.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      event.target.value = "";
    }
  }

  async function onDropFile(
    event: React.DragEvent<HTMLDivElement>,
    kind: UploadKind
  ) {
    event.preventDefault();
    if (kind === "logo") setDragLogo(false);
    if (kind === "cover") setDragCover(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    try {
      await uploadImage(file, kind);
      setMessage(kind === "logo" ? "Logo urcat cu succes." : "Cover urcat cu succes.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    }
  }

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
            data?.message ||
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

        <div
          className={`admin-dropzone ${dragLogo ? "is-dragover" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragLogo(true);
          }}
          onDragLeave={() => setDragLogo(false)}
          onDrop={(event) => void onDropFile(event, "logo")}
          onClick={() => logoInputRef.current?.click()}
        >
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="admin-dropzone-input"
            onChange={(event) => void onFileChange(event, "logo")}
          />
          <div className="admin-dropzone-copy">
            <strong>{uploadingLogo ? "Uploading logo..." : "Drag & drop logo here"}</strong>
            <span>or click to upload to Spaces</span>
          </div>
        </div>

        {logoUrl ? (
          <div className="admin-media-edit-preview">
            <img src={logoUrl} alt={name || "Brand logo"} style={{ objectFit: "contain", padding: 16 }} />
          </div>
        ) : null}

        <div className="admin-form-field">
          <label htmlFor={`brand-cover-${brand?.id || "new"}`}>Cover image URL</label>
          <input
            id={`brand-cover-${brand?.id || "new"}`}
            value={coverImageUrl}
            onChange={(event) => setCoverImageUrl(event.target.value)}
            placeholder="https://..."
          />
        </div>

        <div
          className={`admin-dropzone ${dragCover ? "is-dragover" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragCover(true);
          }}
          onDragLeave={() => setDragCover(false)}
          onDrop={(event) => void onDropFile(event, "cover")}
          onClick={() => coverInputRef.current?.click()}
        >
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="admin-dropzone-input"
            onChange={(event) => void onFileChange(event, "cover")}
          />
          <div className="admin-dropzone-copy">
            <strong>{uploadingCover ? "Uploading cover..." : "Drag & drop cover here"}</strong>
            <span>or click to upload to Spaces</span>
          </div>
        </div>

        {coverImageUrl ? (
          <div className="admin-media-edit-preview">
            <img src={coverImageUrl} alt={name || "Brand cover"} />
          </div>
        ) : null}

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
          <button
            className="admin-submit"
            type="submit"
            disabled={loading || uploadingLogo || uploadingCover}
          >
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
cd /workspaces/wsod/wsod-site || exit 1
git add src/components/dashboard/dashboard-brand-form.tsx
git commit -m "Make brand uploads public in Spaces"
git push origin main