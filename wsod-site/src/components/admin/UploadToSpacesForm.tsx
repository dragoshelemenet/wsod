"use client";

import { useEffect, useMemo, useState } from "react";

interface UploadToSpacesFormProps {
  brands: {
    id: string;
    name: string;
    slug: string;
  }[];
}

const LAST_USED_DATE_KEY = "wsod-last-used-date";
const LAST_USED_BRAND_KEY = "wsod-last-used-brand";
const LAST_USED_CATEGORY_KEY = "wsod-last-used-category";

function inferTypeFromCategory(category: string) {
  switch (category) {
    case "video":
      return "video";
    case "foto":
      return "image";
    case "audio":
      return "audio";
    case "website":
      return "website";
    case "grafica":
    case "meta-ads":
      return "graphic";
    default:
      return "image";
  }
}

function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function UploadToSpacesForm({ brands }: UploadToSpacesFormProps) {
  const [brandSlug, setBrandSlug] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const savedDate = window.localStorage.getItem(LAST_USED_DATE_KEY);
    const savedBrand = window.localStorage.getItem(LAST_USED_BRAND_KEY);
    const savedCategory = window.localStorage.getItem(LAST_USED_CATEGORY_KEY);

    setDate(savedDate || getTodayDate());

    if (savedBrand) {
      setBrandSlug(savedBrand);
    }

    if (savedCategory) {
      setCategory(savedCategory);
    }
  }, []);

  useEffect(() => {
    if (date) {
      window.localStorage.setItem(LAST_USED_DATE_KEY, date);
    }
  }, [date]);

  useEffect(() => {
    if (brandSlug) {
      window.localStorage.setItem(LAST_USED_BRAND_KEY, brandSlug);
    }
  }, [brandSlug]);

  useEffect(() => {
    if (category) {
      window.localStorage.setItem(LAST_USED_CATEGORY_KEY, category);
    }
  }, [category]);

  const inferredType = useMemo(() => inferTypeFromCategory(category), [category]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile || !brandSlug || !category || !title || !date) {
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

      const { uploadUrl, publicUrl, objectKey } = (await presignResponse.json()) as {
        uploadUrl: string;
        publicUrl: string;
        objectKey: string;
      };

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
        throw new Error("Fișierul a fost urcat, dar nu a putut fi făcut public.");
      }

      const saveResponse = await fetch("/api/admin/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandSlug,
          category,
          type: inferredType,
          title,
          description,
          date,
          fileUrl: publicUrl,
          thumbnail: thumbnailUrl || publicUrl,
        }),
      });

      const result = (await saveResponse.json()) as {
        ok: boolean;
        message: string;
      };

      if (!saveResponse.ok || !result.ok) {
        throw new Error(result.message || "Nu s-a putut salva fișierul în DB.");
      }

      setMessage("Fișier urcat în Spaces, făcut public și salvat în baza de date.");
      setTitle("");
      setDescription("");
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
          <label>Tip detectat automat</label>
          <input value={inferredType || "-"} readOnly />
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
          <p className={message.includes("salvat") || message.includes("public") ? "admin-success" : "admin-error"}>
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