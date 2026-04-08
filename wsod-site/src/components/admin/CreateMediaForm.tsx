"use client";

import { useState } from "react";

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

    const payload = {
      brandSlug: String(formData.get("brandSlug") || ""),
      category: String(formData.get("category") || ""),
      type: String(formData.get("type") || ""),
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      date: String(formData.get("date") || ""),
      fileUrl: String(formData.get("fileUrl") || ""),
      thumbnail: String(formData.get("thumbnail") || ""),
    };

    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { ok: boolean; message: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Nu s-a putut crea fișierul.");
      }

      setMessage("Fișier creat.");
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
          <label htmlFor="date">Dată</label>
          <input id="date" name="date" type="date" required />
        </div>

        <div className="admin-form-field">
          <label htmlFor="fileUrl">File URL</label>
          <input
            id="fileUrl"
            name="fileUrl"
            type="text"
            placeholder="/media/demo/coca-cola/test-photo.jpg"
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="thumbnail">Thumbnail URL</label>
          <input
            id="thumbnail"
            name="thumbnail"
            type="text"
            placeholder="/media/demo/coca-cola/test-photo.jpg"
          />
        </div>

        {message ? <p className="admin-helper-text">{message}</p> : null}

        <button type="submit" className="admin-submit" disabled={isSubmitting}>
          {isSubmitting ? "Se creează..." : "Creează fișier"}
        </button>
      </form>
    </div>
  );
}