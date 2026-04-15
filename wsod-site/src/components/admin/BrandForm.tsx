"use client";

import { useMemo, useState } from "react";

interface BrandFormProps {
  brands: {
    id: string;
    name: string;
    slug: string;
  }[];
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
    throw new Error("Nu s-a putut genera URL-ul de upload pentru brand.");
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

export default function BrandForm({ brands }: BrandFormProps) {
  const [name, setName] = useState("");
  const [slugInput, setSlugInput] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [hoverPreview1, setHoverPreview1] = useState("");
  const [hoverPreview2, setHoverPreview2] = useState("");
  const [hoverPreview3, setHoverPreview3] = useState("");
  const [hoverPreview1File, setHoverPreview1File] = useState<File | null>(null);
  const [hoverPreview2File, setHoverPreview2File] = useState<File | null>(null);
  const [hoverPreview3File, setHoverPreview3File] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedSlug = useMemo(() => {
    return slugify(slugInput || name);
  }, [slugInput, name]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setMessage("Numele brandului este obligatoriu.");
      return;
    }

    if (!normalizedSlug) {
      setMessage("Slug invalid pentru brand.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      let finalLogoUrl = logoUrl.trim();
      let finalHoverPreview1 = hoverPreview1.trim();
      let finalHoverPreview2 = hoverPreview2.trim();
      let finalHoverPreview3 = hoverPreview3.trim();

      if (logoFile) {
        const uploadedLogo = await presignAndUploadFile(logoFile, normalizedSlug, "brand-logo");
        finalLogoUrl = uploadedLogo.publicUrl;
      }

      if (hoverPreview1File) {
        const uploaded = await presignAndUploadFile(
          hoverPreview1File,
          normalizedSlug,
          "brand-hover-preview-1"
        );
        finalHoverPreview1 = uploaded.publicUrl;
      }

      if (hoverPreview2File) {
        const uploaded = await presignAndUploadFile(
          hoverPreview2File,
          normalizedSlug,
          "brand-hover-preview-2"
        );
        finalHoverPreview2 = uploaded.publicUrl;
      }

      if (hoverPreview3File) {
        const uploaded = await presignAndUploadFile(
          hoverPreview3File,
          normalizedSlug,
          "brand-hover-preview-3"
        );
        finalHoverPreview3 = uploaded.publicUrl;
      }

      const response = await fetch("/api/admin/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug: normalizedSlug,
          logoUrl: finalLogoUrl,
          coverImageUrl: "",
          hoverPreview1: finalHoverPreview1,
          hoverPreview2: finalHoverPreview2,
          hoverPreview3: finalHoverPreview3,
          description,
          seoTitle,
          metaDescription,
        }),
      });

      const result = (await response.json()) as {
        ok: boolean;
        message: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Nu s-a putut crea brandul.");
      }

      setMessage("Brand creat cu succes.");
      setName("");
      setSlugInput("");
      setLogoUrl("");
      setLogoFile(null);
      setHoverPreview1("");
      setHoverPreview2("");
      setHoverPreview3("");
      setHoverPreview1File(null);
      setHoverPreview2File(null);
      setHoverPreview3File(null);
      setDescription("");
      setSeoTitle("");
      setMetaDescription("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscută.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-panel-card">
      <div className="admin-card-head">
        <h2>1. Brand nou</h2>
      </div>

      <form className="admin-stack" onSubmit={handleSubmit}>
        <div className="admin-form-field">
          <label htmlFor="brand-name">Nume brand</label>
          <input
            id="brand-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Mosimo Barbershop"
            required
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="brand-slug">Slug</label>
          <input
            id="brand-slug"
            value={slugInput}
            onChange={(e) => setSlugInput(e.target.value)}
            placeholder="Lasă gol pentru auto din nume"
          />
          <p className="admin-helper-text">
            Slug final: <strong>{normalizedSlug || "—"}</strong>
          </p>
        </div>

        <div className="admin-form-field">
          <label htmlFor="brand-logo-file">Logo / imagine folder în Spaces</label>
          <input
            id="brand-logo-file"
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="brand-logo">Logo URL</label>
          <input
            id="brand-logo"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="URL logo brand"
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="brand-hover-1-file">Hover preview 1</label>
          <input
            id="brand-hover-1-file"
            type="file"
            accept="image/*"
            onChange={(e) => setHoverPreview1File(e.target.files?.[0] ?? null)}
          />
          <input
            value={hoverPreview1}
            onChange={(e) => setHoverPreview1(e.target.value)}
            placeholder="URL hover preview 1"
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="brand-hover-2-file">Hover preview 2</label>
          <input
            id="brand-hover-2-file"
            type="file"
            accept="image/*"
            onChange={(e) => setHoverPreview2File(e.target.files?.[0] ?? null)}
          />
          <input
            value={hoverPreview2}
            onChange={(e) => setHoverPreview2(e.target.value)}
            placeholder="URL hover preview 2"
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="brand-hover-3-file">Hover preview 3</label>
          <input
            id="brand-hover-3-file"
            type="file"
            accept="image/*"
            onChange={(e) => setHoverPreview3File(e.target.files?.[0] ?? null)}
          />
          <input
            value={hoverPreview3}
            onChange={(e) => setHoverPreview3(e.target.value)}
            placeholder="URL hover preview 3"
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="brand-description">Descriere</label>
          <textarea
            id="brand-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="brand-seo-title">SEO title</label>
          <input
            id="brand-seo-title"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="brand-meta-description">Meta description</label>
          <textarea
            id="brand-meta-description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={3}
          />
        </div>

        {brands.length ? (
          <p className="admin-helper-text">
            Branduri existente: {brands.map((brand) => brand.name).join(", ")}
          </p>
        ) : null}

        {message ? (
          <p className={message.includes("succes") ? "admin-success" : "admin-error"}>
            {message}
          </p>
        ) : null}

        <button type="submit" className="admin-submit" disabled={isSubmitting}>
          {isSubmitting ? "Se creează..." : "Creează brand"}
        </button>
      </form>
    </div>
  );
}
