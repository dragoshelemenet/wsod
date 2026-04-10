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

function getTodayMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

function base64ToFile(base64: string, filename: string, mimeType: string) {
  const byteString = atob(base64);
  const byteNumbers = new Array(byteString.length);

  for (let i = 0; i < byteString.length; i += 1) {
    byteNumbers[i] = byteString.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], filename, { type: mimeType });
}

function photoOutfitOptions() {
  return [
    { value: "", label: "Selectează outfit" },
    { value: "OUTFIT schimbat cu AI", label: "OUTFIT schimbat cu AI", groupOrder: 0 },
    { value: "OUTFIT REAL", label: "OUTFIT REAL", groupOrder: 10 },
  ];
}

function graphicKindOptions() {
  return [
    { value: "", label: "Selectează tipul grafic" },
    { value: "flyer", label: "flyer" },
    { value: "banner-ad", label: "banner-ad" },
    { value: "business-card", label: "business-card" },
    { value: "menu-redesign", label: "menu-redesign" },
    { value: "logo-reinvented", label: "logo-reinvented" },
    { value: "menu", label: "menu" },
  ];
}

function fileNameToTitle(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").trim();
}

function buildItemTitle(baseTitle: string, file: File, totalFiles: number) {
  if (totalFiles === 1 && baseTitle.trim()) {
    return baseTitle.trim();
  }

  return fileNameToTitle(file.name) || baseTitle.trim() || "Media item";
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const [groupLabel, setGroupLabel] = useState("");
  const [groupOrder, setGroupOrder] = useState(0);
  const [graphicKind, setGraphicKind] = useState("");

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

    setDate(savedDate || getTodayMonth());

    if (savedCategory) setCategory(savedCategory);
    if (savedBrand) setBrandSlug(savedBrand);
    if (savedModel) setPersonModelSlug(savedModel);
    if (savedAudioProfile) setAudioProfileSlug(savedAudioProfile);

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

  useEffect(() => {
    if (!(category === "foto" && ownerType === "model")) {
      setGroupLabel("");
      setGroupOrder(0);
    }

    if (category !== "grafica") {
      setGraphicKind("");
    }
  }, [category, ownerType]);

  const inferredType = useMemo(() => inferTypeFromCategory(category), [category]);

  function addFiles(nextFiles: File[]) {
    if (!nextFiles.length) return;

    setSelectedFiles((current) => {
      const seen = new Set(current.map((file) => `${file.name}-${file.size}-${file.lastModified}`));
      const merged = [...current];

      for (const file of nextFiles) {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        if (!seen.has(key)) {
          merged.push(file);
          seen.add(key);
        }
      }

      return merged;
    });
  }

  function removeFile(indexToRemove: number) {
    setSelectedFiles((current) => current.filter((_, index) => index !== indexToRemove));
  }

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

  async function presignAndUploadFile(file: File, uploadOwnerSlug: string, uploadCategory: string) {
    const presignResponse = await fetch("/api/uploads/presign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        brandSlug: uploadOwnerSlug,
        category: uploadCategory,
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

    return { publicUrl };
  }

  async function uploadSingleFile(file: File, totalFiles: number) {
    let uploadOwnerSlug = brandSlug;
    if (category === "foto" && ownerType === "model") {
      uploadOwnerSlug = personModelSlug;
    }
    if (category === "audio") {
      uploadOwnerSlug = audioProfileSlug;
    }

    const originalUpload = await presignAndUploadFile(
      file,
      uploadOwnerSlug,
      category
    );

    let finalThumbnailUrl = thumbnailUrl || originalUpload.publicUrl;
    let finalPreviewUrl = originalUpload.publicUrl;

    const isImage =
      inferredType === "image" &&
      file.type.startsWith("image/");

    const isVideo =
      inferredType === "video" &&
      file.type.startsWith("video/");

    if (isImage) {
      const variantForm = new FormData();
      variantForm.append("file", file);

      const variantsResponse = await fetch("/api/uploads/image-variants", {
        method: "POST",
        body: variantForm,
      });

      if (variantsResponse.ok) {
        const variantsResult = (await variantsResponse.json()) as {
          ok: boolean;
          thumbnailBase64?: string;
          previewBase64?: string;
          mimeType?: string;
        };

        if (
          variantsResult.ok &&
          variantsResult.thumbnailBase64 &&
          variantsResult.previewBase64 &&
          variantsResult.mimeType
        ) {
          const thumbnailFile = base64ToFile(
            variantsResult.thumbnailBase64,
            `thumb-${file.name}.jpg`,
            variantsResult.mimeType
          );

          const previewFile = base64ToFile(
            variantsResult.previewBase64,
            `preview-${file.name}.jpg`,
            variantsResult.mimeType
          );

          const thumbnailUpload = await presignAndUploadFile(
            thumbnailFile,
            uploadOwnerSlug,
            `${category}-thumb`
          );

          const previewUpload = await presignAndUploadFile(
            previewFile,
            uploadOwnerSlug,
            `${category}-preview`
          );

          finalThumbnailUrl = thumbnailUpload.publicUrl;
          finalPreviewUrl = previewUpload.publicUrl;
        }
      }
    }

    if (isVideo) {
      const posterForm = new FormData();
      posterForm.append("file", file);

      const posterResponse = await fetch("/api/uploads/video-poster", {
        method: "POST",
        body: posterForm,
      });

      if (posterResponse.ok) {
        const posterResult = (await posterResponse.json()) as {
          ok: boolean;
          posterBase64?: string;
          mimeType?: string;
        };

        if (
          posterResult.ok &&
          posterResult.posterBase64 &&
          posterResult.mimeType
        ) {
          const posterFile = base64ToFile(
            posterResult.posterBase64,
            `poster-${file.name}.jpg`,
            posterResult.mimeType
          );

          const posterUpload = await presignAndUploadFile(
            posterFile,
            uploadOwnerSlug,
            `${category}-poster`
          );

          finalThumbnailUrl = posterUpload.publicUrl;
        }
      }
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
        title: buildItemTitle(title, file, totalFiles),
        description,
        seoTitle,
        metaDescription,
        date: `${date}-01`,
        fileUrl: originalUpload.publicUrl,
        thumbnailUrl: finalThumbnailUrl,
        previewUrl: finalPreviewUrl,
        fileNameOriginal: file.name,
        groupLabel: category === "foto" && ownerType === "model" ? groupLabel : "",
        groupOrder: category === "foto" && ownerType === "model" ? groupOrder : 0,
        graphicKind: category === "grafica" ? graphicKind : "",
      }),
    });

    const result = (await saveResponse.json()) as {
      ok: boolean;
      message: string;
    };

    if (!saveResponse.ok || !result.ok) {
      throw new Error(result.message || `Nu s-a putut salva fișierul ${file.name} în DB.`);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedFiles.length || !category || !date) {
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

    if (category === "foto" && ownerType === "model" && !groupLabel) {
      setMessage("Selectează tipul outfitului.");
      return;
    }

    if (category === "grafica" && !graphicKind) {
      setMessage("Selectează tipul materialului grafic.");
      return;
    }

    if (selectedFiles.length === 1 && !title.trim()) {
      setMessage("La upload simplu, completează și titlul.");
      return;
    }

    try {
      setIsUploading(true);
      setMessage("");

      for (const file of selectedFiles) {
        await uploadSingleFile(file, selectedFiles.length);
      }

      setMessage(
        selectedFiles.length === 1
          ? "Fișier urcat și salvat cu succes."
          : `${selectedFiles.length} fișiere urcate și salvate cu succes.`
      );

      setTitle("");
      setDescription("");
      setSeoTitle("");
      setMetaDescription("");
      setThumbnailUrl("");
      setSelectedFiles([]);
      setGroupLabel("");
      setGroupOrder(0);
      setGraphicKind("");
      setIsDragOver(false);
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
              <label htmlFor="photoOutfit">Outfit</label>
              <select
                id="photoOutfit"
                className="admin-select"
                value={groupLabel}
                onChange={(e) => {
                  const selected = photoOutfitOptions().find((option) => option.value === e.target.value);
                  setGroupLabel(e.target.value);
                  setGroupOrder(selected?.groupOrder ?? 0);
                }}
                required
              >
                {photoOutfitOptions().map((option) => (
                  <option key={option.value || "empty"} value={option.value}>
                    {option.label}
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

        {category === "grafica" ? (
          <div className="admin-form-field">
            <label htmlFor="graphicKind">Tip material grafic</label>
            <select
              id="graphicKind"
              className="admin-select"
              value={graphicKind}
              onChange={(e) => setGraphicKind(e.target.value)}
              required
            >
              {graphicKindOptions().map((option) => (
                <option key={option.value || "empty"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="admin-form-field">
          <label htmlFor="title">
            Titlu {selectedFiles.length > 1 ? "(opțional la upload multiplu)" : ""}
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required={selectedFiles.length <= 1}
            placeholder={
              selectedFiles.length > 1
                ? "Dacă lași gol, fiecare fișier va primi numele lui"
                : ""
            }
          />
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
          <label htmlFor="date">Lună / an</label>
          <input id="date" type="month" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="admin-form-field">
          <label htmlFor="thumbnailUrl">Thumbnail URL opțional</label>
          <input
            id="thumbnailUrl"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="Poți lăsa gol pentru a genera automat sau pentru a folosi fișierul urcat"
          />
        </div>

        <div className="admin-form-field">
          <label>Fișiere</label>

          <label
            className={`admin-dropzone${isDragOver ? " is-drag-over" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragOver(true);
            }}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              if (event.currentTarget === event.target) {
                setIsDragOver(false);
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragOver(false);
              addFiles(Array.from(event.dataTransfer.files ?? []));
            }}
          >
            <input
              id="file"
              type="file"
              multiple
              className="admin-dropzone-input"
              onChange={(e) => addFiles(Array.from(e.target.files ?? []))}
              required={!selectedFiles.length}
            />
            <div className="admin-dropzone-copy">
              <strong>Trage imaginile aici</strong>
              <span>sau apasă pentru a selecta mai multe fișiere</span>
            </div>
          </label>

          {selectedFiles.length ? (
            <div className="admin-selected-files">
              {selectedFiles.map((file, index) => (
                <div key={`${file.name}-${file.size}-${file.lastModified}`} className="admin-selected-file-chip">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    className="admin-file-chip-remove"
                    onClick={() => removeFile(index)}
                    aria-label={`Șterge ${file.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {message ? (
          <p className={message.includes("succes") || message.includes("creat") ? "admin-success" : "admin-error"}>
            {message}
          </p>
        ) : null}

        <button type="submit" className="admin-submit" disabled={isUploading}>
          {isUploading
            ? `Se urcă${selectedFiles.length > 1 ? ` ${selectedFiles.length} fișiere...` : "..."}`
            : selectedFiles.length > 1
              ? `Upload ${selectedFiles.length} fișiere`
              : "Upload în Spaces"}
        </button>
      </form>
    </div>
  );
}
