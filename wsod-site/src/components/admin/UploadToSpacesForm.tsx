"use client";

import { useEffect, useState } from "react";

interface UploadToSpacesFormProps {
  brands: {
    id: string;
    name: string;
    slug: string;
  }[];
  models?: {
    id: string;
    name: string;
    slug: string;
  }[];
}

const LAST_USED_DATE_KEY = "wsod-last-used-date";
const LAST_USED_BRAND_KEY = "wsod-last-used-brand";
const LAST_USED_CATEGORY_KEY = "wsod-last-used-category";
const LAST_USED_OWNER_TYPE_KEY = "wsod-last-used-owner-type";
const LAST_USED_MODEL_KEY = "wsod-last-used-model";

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

export default function UploadToSpacesForm({
  brands,
  models = [],
}: UploadToSpacesFormProps) {
  const [ownerType, setOwnerType] = useState<"brand" | "model">("brand");
  const [brandSlug, setBrandSlug] = useState("");
  const [personModelSlug, setPersonModelSlug] = useState("");
  const [newModelName, setNewModelName] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingModel, setIsCreatingModel] = useState(false);

  useEffect(() => {
    const savedDate = window.localStorage.getItem(LAST_USED_DATE_KEY);
    const savedBrand = window.localStorage.getItem(LAST_USED_BRAND_KEY);
    const savedCategory = window.localStorage.getItem(LAST_USED_CATEGORY_KEY);
    const savedOwnerType = window.localStorage.getItem(LAST_USED_OWNER_TYPE_KEY);
    const savedModel = window.localStorage.getItem(LAST_USED_MODEL_KEY);

    setDate(savedDate || getTodayDate());

    if (savedBrand) {
      setBrandSlug(savedBrand);
    }

    if (savedCategory) {
      setCategory(savedCategory);
    }

    if (savedOwnerType === "model" || savedOwnerType === "brand") {
      setOwnerType(savedOwnerType);
    }

    if (savedModel) {
      setPersonModelSlug(savedModel);
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

  useEffect(() => {
    window.localStorage.setItem(LAST_USED_OWNER_TYPE_KEY, ownerType);
  }, [ownerType]);

  useEffect(() => {
    if (personModelSlug) {
      window.localStorage.setItem(LAST_USED_MODEL_KEY, personModelSlug);
    }
  }, [personModelSlug]);

  useEffect(() => {
    if (category !== "foto" && ownerType === "model") {
      setOwnerType("brand");
    }
  }, [category, ownerType]);

  const inferredType = inferTypeFromCategory(category);

  async function handleCreateModel() {
    if (!newModelName.trim()) {
      setMessage("Scrie numele modelului.");
      return;
    }

    try {
      setIsCreatingModel(true);
      setMessage("");

      const response = await fetch("/api/admin/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newModelName,
        }),
      });

      const result = (await response.json()) as {
        ok: boolean;
        message: string;
        personModel?: {
          slug: string;
        };
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Nu s-a putut crea modelul.");
      }

      setMessage("Model creat. Reîncarcă pagina ca să apară în listă.");
      setNewModelName("");

      if (result.personModel?.slug) {
        setPersonModelSlug(result.personModel.slug);
      }
    } catch (error) {
      const text = error instanceof Error ? error.message : "Eroare necunoscută.";
      setMessage(text);
    } finally {
      setIsCreatingModel(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile || !category || !title || !date) {
      setMessage("Completează toate câmpurile obligatorii.");
      return;
    }

    if (ownerType === "brand" && !brandSlug) {
      setMessage("Selectează un brand.");
      return;
    }

    if (ownerType === "model" && !personModelSlug) {
      setMessage("Selectează un model.");
      return;
    }

    try {
      setIsUploading(true);
      setMessage("");

      const uploadOwnerSlug = ownerType === "model" ? personModelSlug : brandSlug;

      const presignResponse = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: selectedFile.name,
          contentType: selectedFile.type,
          brandSlug: uploadOwnerSlug,
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
          ownerType,
          brandSlug: ownerType === "brand" ? brandSlug : "",
          personModelSlug: ownerType === "model" ? personModelSlug : "",
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

      setMessage("Fișier urcat și salvat cu succes.");
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
        {category === "foto" ? (
          <div className="admin-form-field">
            <label htmlFor="ownerType">Asociere foto</label>
            <select
              id="ownerType"
              className="admin-select"
              value={ownerType}
              onChange={(e) => setOwnerType(e.target.value as "brand" | "model")}
            >
              <option value="brand">Brand</option>
              <option value="model">Model</option>
            </select>
          </div>
        ) : null}

        {ownerType === "brand" ? (
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
        ) : null}

        {category === "foto" && ownerType === "model" ? (
          <>
            <div className="admin-form-field">
              <label htmlFor="personModelSlug">Model</label>
              <select
                id="personModelSlug"
                className="admin-select"
                value={personModelSlug}
                onChange={(e) => setPersonModelSlug(e.target.value)}
                required
              >
                <option value="">Selectează modelul</option>
                {models.map((model) => (
                  <option key={model.id} value={model.slug}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-field">
              <label htmlFor="newModelName">Model nou</label>
              <input
                id="newModelName"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                placeholder="Scrie numele modelului nou"
              />
              <button
                type="button"
                className="admin-submit"
                onClick={handleCreateModel}
                disabled={isCreatingModel}
              >
                {isCreatingModel ? "Se creează..." : "Creează model"}
              </button>
            </div>
          </>
        ) : null}

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
          <p className={message.includes("succes") || message.includes("creat") ? "admin-success" : "admin-error"}>
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