"use client";

import { useState } from "react";
import { uploadToSpaces } from "@/lib/uploads/upload-to-spaces";

interface CreateMediaFormProps {
  brands: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export default function CreateMediaForm({ brands }: CreateMediaFormProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const brandSlug = String(formData.get("brandSlug") || "").trim();
      const category = String(formData.get("category") || "").trim();
      const type = String(formData.get("type") || "").trim();
      const title = String(formData.get("title") || "").trim();
      const description = String(formData.get("description") || "").trim();
      const seoTitle = String(formData.get("seoTitle") || "").trim();
      const metaDescription = String(formData.get("metaDescription") || "").trim();
      const date = String(formData.get("date") || "").trim();

      const file = formData.get("file") as File | null;
      const thumbnailFile = formData.get("thumbnailFile") as File | null;
      const previewFile = formData.get("previewFile") as File | null;

      if (!brandSlug) throw new Error("Selectează brandul.");
      if (!category) throw new Error("Selectează categoria.");
      if (!type) throw new Error("Selectează tipul media.");
      if (!title) throw new Error("Titlul este obligatoriu.");
      if (!date) throw new Error("Data este obligatorie.");
      if (!file || file.size === 0) throw new Error("Selectează fișierul principal.");

      const uploadedMain = await uploadToSpaces({
        file,
        brandSlug,
        category,
      });

      let thumbnailUrl = "";
      let previewUrl = "";

      if (thumbnailFile && thumbnailFile.size > 0) {
        const uploadedThumb = await uploadToSpaces({
          file: thumbnailFile,
          brandSlug,
          category: `${category}-thumb`,
        });
        thumbnailUrl = uploadedThumb.url;
      }

      if (previewFile && previewFile.size > 0) {
        const uploadedPreview = await uploadToSpaces({
          file: previewFile,
          brandSlug,
          category: `${category}-preview`,
        });
        previewUrl = uploadedPreview.url;
      }

      const payload = {
        ownerType: "brand",
        brandSlug,
        category,
        type,
        title,
        description,
        seoTitle,
        metaDescription,
        date,
        fileUrl: uploadedMain.url,
        thumbnailUrl,
        previewUrl,
        fileNameOriginal: file.name,
      };

      const response = await fetch("/api/admin/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string }
        | null;

      if (!response.ok || !result?.ok) {
        throw new Error(result?.message || "Nu s-a putut salva media.");
      }

      setMessage("Media salvată cu succes.");
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscută.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-panel-card">
      <div className="admin-card-head">
        <h2>2. Creează fișier nou</h2>
      </div>

      <form onSubmit={handleSubmit} className="admin-stack">
        <div className="admin-form-field">
          <label htmlFor="brandSlug">Brand</label>
          <select id="brandSlug" name="brandSlug" className="admin-select" required>
            <option value="">Selectează brandul</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form-field">
          <label htmlFor="category">Categorie</label>
          <select id="category" name="category" className="admin-select" required>
            <option value="">Selectează categoria</option>
            <option value="video">VIDEO</option>
            <option value="foto">PHOTO</option>
            <option value="grafica">GRAPHIC</option>
            <option value="website">WEBSITE</option>
            <option value="meta-ads">META ADS</option>
            <option value="audio">AUDIO</option>
          </select>
        </div>

        <div className="admin-form-field">
          <label htmlFor="type">Tip</label>
          <select id="type" name="type" className="admin-select" required>
            <option value="">Selectează tipul</option>
            <option value="video">video</option>
            <option value="image">image</option>
            <option value="audio">audio</option>
            <option value="website">website</option>
            <option value="graphic">graphic</option>
          </select>
        </div>

        <div className="admin-form-field">
          <label htmlFor="title">Titlu</label>
          <input id="title" name="title" type="text" required />
        </div>

        <div className="admin-form-field">
          <label htmlFor="description">Descriere</label>
          <input id="description" name="description" type="text" />
        </div>

        <div className="admin-form-field">
          <label htmlFor="seoTitle">SEO Title</label>
          <input id="seoTitle" name="seoTitle" type="text" />
        </div>

        <div className="admin-form-field">
          <label htmlFor="metaDescription">Meta Description</label>
          <input id="metaDescription" name="metaDescription" type="text" />
        </div>

        <div className="admin-form-field">
          <label htmlFor="date">Dată</label>
          <input id="date" name="date" type="date" required />
        </div>

        <div className="admin-form-field">
          <label htmlFor="file">Fișier principal</label>
          <input id="file" name="file" type="file" required />
        </div>

        <div className="admin-form-field">
          <label htmlFor="thumbnailFile">Thumbnail</label>
          <input id="thumbnailFile" name="thumbnailFile" type="file" />
        </div>

        <div className="admin-form-field">
          <label htmlFor="previewFile">Preview</label>
          <input id="previewFile" name="previewFile" type="file" />
        </div>

        {message ? <p className="admin-helper-text">{message}</p> : null}

        <button type="submit" className="admin-submit" disabled={isSubmitting}>
          {isSubmitting ? "Se încarcă..." : "Creează fișier"}
        </button>
      </form>
    </div>
  );
}
