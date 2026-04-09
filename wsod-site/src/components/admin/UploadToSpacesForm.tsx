"use client";

import { useEffect, useMemo, useState } from "react";

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
  audioProfiles?: {
    id: string;
    name: string;
    slug: string;
    kind: string;
  }[];
}

const LAST_USED_DATE_KEY = "wsod-last-used-date";
const LAST_USED_CATEGORY_KEY = "wsod-last-used-category";
const LAST_USED_BRAND_KEY = "wsod-last-used-brand";
const LAST_USED_MODEL_KEY = "wsod-last-used-model";
const LAST_USED_AUDIO_PROFILE_KEY = "wsod-last-used-audio-profile";
const LAST_USED_OWNER_TYPE_KEY = "wsod-last-used-owner-type";

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
  audioProfiles = [],
}: UploadToSpacesFormProps) {
  const [category, setCategory] = useState("");
  const [ownerType, setOwnerType] = useState<"brand" | "model" | "audioProfile">("brand");

  const [brandSlug, setBrandSlug] = useState("");
  const [personModelSlug, setPersonModelSlug] = useState("");
  const [audioProfileSlug, setAudioProfileSlug] = useState("");

  const [newModelName, setNewModelName] = useState("");
  const [newAudioProfileName, setNewAudioProfileName] = useState("");
  const [newAudioProfileKind, setNewAudioProfileKind] = useState("artist");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [date, setDate] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingModel, setIsCreatingModel] = useState(false);
  const [isCreatingAudioProfile, setIsCreatingAudioProfile] = useState(false);

  useEffect(() => {
    const savedDate = window.localStorage.getItem(LAST_USED_DATE_KEY);
    const savedCategory = window.localStorage.getItem(LAST_USED_CATEGORY_KEY);
    const savedBrand = window.localStorage.getItem(LAST_USED_BRAND_KEY);
    const savedModel = window.localStorage.getItem(LAST_USED_MODEL_KEY);
    const savedAudioProfile = window.localStorage.getItem(LAST_USED_AUDIO_PROFILE_KEY);
    const savedOwnerType = window.localStorage.getItem(LAST_USED_OWNER_TYPE_KEY);

    setDate(savedDate || getTodayDate());

    if (savedCategory) {
      setCategory(savedCategory);
    }
    if (savedBrand) {
      setBrandSlug(savedBrand);
    }
    if (savedModel) {
      setPersonModelSlug(savedModel);
    }
    if (savedAudioProfile) {
      setAudioProfileSlug(savedAudioProfile);
    }
    if (savedOwnerType === "brand" || savedOwnerType === "model" || savedOwnerType === "audioProfile") {
      setOwnerType(savedOwnerType);
    }
  }, []);

  useEffect(() => {
    if (date) window.localStorage.setItem(LAST_USED_DATE_KEY, date);
  }, [date]);

  useEffect(() => {
    if (category) window.localStorage.setItem(LAST_USED_CATEGORY_KEY, category);
  }, [category]);

  useEffect(() => {
    if (brandSlug) window.localStorage.setItem(LAST_USED_BRAND_KEY, brandSlug);
  }, [brandSlug]);

  useEffect(() => {
    if (personModelSlug) window.localStorage.setItem(LAST_USED_MODEL_KEY, personModelSlug);
  }, [personModelSlug]);

  useEffect(() => {
    if (audioProfileSlug) window.localStorage.setItem(LAST_USED_AUDIO_PROFILE_KEY, audioProfileSlug);
  }, [audioProfileSlug]);

  useEffect(() => {
    window.localStorage.setItem(LAST_USED_OWNER_TYPE_KEY, ownerType);
  }, [ownerType]);

  useEffect(() => {
    if (category === "foto") {
      if (ownerType !== "brand" && ownerType !== "model") {
        setOwnerType("brand");
      }
      return;
    }

    if (category === "audio") {
      setOwnerType("audioProfile");
      return;
    }

    if (category) {
      setOwnerType("brand");
    }
  }, [category, ownerType]);

  const inferredType = useMemo(() => inferTypeFromCategory(category), [category]);

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
        personModel?: { slug: string };
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
      setMessage(error instanceof Error ? error.message : "Eroare necunoscută.");
    } finally {
      setIsCreatingModel(false);
    }
  }

  async function handleCreateAudioProfile() {
    if (!newAudioProfileName.trim()) {
      setMessage("Scrie numele profilului audio.");
      return;
    }

    try {
      setIsCreatingAudioProfile(true);
      setMessage("");

      const response = await fetch("/api/admin/audio-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newAudioProfileName,
          kind: newAudioProfileKind,
        }),
      });

      const result = (await response.json()) as {
        ok: boolean;
        message: string;
        audioProfile?: { slug: string };
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Nu s-a putut crea profilul audio.");
      }

      setMessage("Profil audio creat. Reîncarcă pagina ca să apară în listă.");
      setNewAudioProfileName("");

      if (result.audioProfile?.slug) {
        setAudioProfileSlug(result.audioProfile.slug);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscută.");
    } finally {
      setIsCreatingAudioProfile(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFile || !category || !title || !date) {
      setMessage("Completează toate câmpurile obligatorii.");
      return;
    }

    if (category === "foto" && ownerType === "brand" && !brandSlug) {
      setMessage("Selectează un brand.");
      return;
    }

    if (category === "foto" && ownerType === "model" && !personModelSlug) {
      setMessage("Selectează un model.");
      return;
    }

    if (category === "audio" && !audioProfileSlug) {
      setMessage("Selectează un profil audio.");
      return;
    }

    if (!["foto", "audio"].includes(category) && !brandSlug) {
      setMessage("Selectează un brand.");
      return;
    }

    try {
      setIsUploading(true);
      setMessage("");

      let uploadOwnerSlug = brandSlug;
      if (category === "foto" && ownerType === "model") {
        uploadOwnerSlug = personModelSlug;
      }
      if (category === "audio") {
        uploadOwnerSlug = audioProfileSlug;
      }

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
          audioProfileSlug: ownerType === "audioProfile" ? audioProfileSlug : "",
          category,
          type: inferredType,
          title,
          description,
          seoTitle,
          metaDescription,
          date,
          fileUrl: publicUrl,
          thumbnailUrl: thumbnailUrl || publicUrl,
          previewUrl: publicUrl,
          fileNameOriginal: selectedFile.name,
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
      setSeoTitle("");
      setMetaDescription("");
      setThumbnailUrl("");
      setSelectedFile(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscută.");
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

        {category === "audio" ? (
          <>
            <div className="admin-form-field">
              <label htmlFor="audioProfileSlug">Profil audio</label>
              <select
                id="audioProfileSlug"
                className="admin-select"
                value={audioProfileSlug}
                onChange={(e) => setAudioProfileSlug(e.target.value)}
                required
              >
                <option value="">Selectează profilul audio</option>
                {audioProfiles.map((profile) => (
                  <option key={profile.id} value={profile.slug}>
                    {profile.name} ({profile.kind})
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-field">
              <label htmlFor="newAudioProfileName">Profil audio nou</label>
              <input
                id="newAudioProfileName"
                value={newAudioProfileName}
                onChange={(e) => setNewAudioProfileName(e.target.value)}
                placeholder="Scrie numele profilului audio nou"
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="newAudioProfileKind">Tip profil audio</label>
              <select
                id="newAudioProfileKind"
                className="admin-select"
                value={newAudioProfileKind}
                onChange={(e) => setNewAudioProfileKind(e.target.value)}
              >
                <option value="artist">artist</option>
                <option value="podcast">podcast</option>
                <option value="show">show</option>
                <option value="project">project</option>
              </select>
              <button
                type="button"
                className="admin-submit"
                onClick={handleCreateAudioProfile}
                disabled={isCreatingAudioProfile}
              >
                {isCreatingAudioProfile ? "Se creează..." : "Creează profil audio"}
              </button>
            </div>
          </>
        ) : null}

        {category !== "audio" && ownerType === "brand" ? (
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
          <label htmlFor="title">Titlu</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="admin-form-field">
          <label htmlFor="description">Descriere</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="seoTitle">SEO title opțional</label>
          <input
            id="seoTitle"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="Titlu pentru Google, dacă vrei diferit de titlul principal"
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="metaDescription">Meta description opțional</label>
          <textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={3}
            placeholder="Descriere scurtă pentru Google"
          />
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