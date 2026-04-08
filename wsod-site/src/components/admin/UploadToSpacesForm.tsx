"use client";

import { useState } from "react";
import { createMediaAction } from "@/app/actions/admin-actions";

interface UploadToSpacesFormProps {
  brands: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export default function UploadToSpacesForm({ brands }: UploadToSpacesFormProps) {
  const [brandSlug, setBrandSlug] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile || !brandSlug || !category || !type || !title || !date) {
      setMessage("Completează toate câmpurile obligatorii.");
      return;
    }

    try {
      setIsUploading(true);
      setMessage("");

      const presignResponse = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: selectedFile.name,
          contentType: selectedFile.type,
          brandSlug,
          category,
        }),
      });

      if (!presignResponse.ok) {
        throw new Error("Nu s-a putut genera URL-ul de upload.");
      }

      const { uploadUrl, publicUrl } = await presignResponse.json();

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload-ul către Spaces a eșuat.");
      }

      const formData = new FormData();
      formData.set("brandSlug", brandSlug);
      formData.set("category", category);
      formData.set("type", type);
      formData.set("title", title);
      formData.set("description", description);
      formData.set("date", date);
      formData.set("fileUrl", publicUrl);
      formData.set("thumbnail", thumbnailUrl || publicUrl);

      const result = await createMediaAction(formData);

      if (!result?.ok) {
        throw new Error(result?.message || "Nu s-a putut salva fișierul în DB.");
      }

      setMessage("Fișier urcat în Spaces și salvat în baza de date.");
      setTitle("");
      setDescription("");
      setDate("");
      setThumbnailUrl("");
      setSelectedFile(null);
    } catch (error) {
      const text = error instanceof Error ? error.message : "Eroare necunoscută.";
      setMessage(text);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="admin-panel-card">
      <div className="admin-card-head">
        <h2>2. Upload în Spaces</h2>
      </div>

      <form className="admin-stack" onSubmit={handleSubmit}>
        <div className="admin-form-field">
          <label htmlFor="brandSlug">Brand</label>
          <select
            id="brandSlug"
            className="admin-select"
            value={brandSlug}
            onChange={(e) => setBrandSlug(e.target.value)}
            required
          >
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
          <select
            id="category"
            className="admin-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
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
          <select
            id="type"
            className="admin-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
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
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="admin-form-field">
          <label htmlFor="description">Descriere</label>
          <input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="admin-form-field">
          <label htmlFor="date">Dată</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="admin-form-field">
          <label htmlFor="thumbnailUrl">Thumbnail URL opțional</label>
          <input
            id="thumbnailUrl"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="Poți lăsa gol pentru a folosi fișierul urcat"
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="file">Fișier</label>
          <input
            id="file"
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            required
          />
        </div>

        {message ? (
          <p className={message.includes("salvat") ? "admin-success" : "admin-error"}>
            {message}
          </p>
        ) : null}

        <button type="submit" className="admin-submit" disabled={isUploading}>
          {isUploading ? "Se urcă..." : "Upload în Spaces"}
        </button>
      </form>
    </div>
  );
}