"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type TalentKind = "artist" | "influencer";

type DashboardTalentFormProps = {
  kind: TalentKind;
  mode?: "create" | "edit";
  item?: {
    id: string;
    name: string;
    slug: string;
    kind: TalentKind;
    portraitImageUrl?: string | null;
    coverImageUrl?: string | null;
    description?: string | null;
    isVisible?: boolean;
  } | null;
  onDone?: () => void;
};

type UploadKind = "portrait" | "cover";

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

export function DashboardTalentForm({
  kind,
  mode = "create",
  item = null,
  onDone,
}: DashboardTalentFormProps) {
  const router = useRouter();

  const portraitInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(item?.name || "");
  const [slug, setSlug] = useState(item?.slug || "");
  const [portraitImageUrl, setPortraitImageUrl] = useState(item?.portraitImageUrl || "");
  const [coverImageUrl, setCoverImageUrl] = useState(item?.coverImageUrl || "");
  const [description, setDescription] = useState(item?.description || "");
  const [isVisible, setIsVisible] = useState(item?.isVisible ?? true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadingPortrait, setUploadingPortrait] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [dragPortrait, setDragPortrait] = useState(false);
  const [dragCover, setDragCover] = useState(false);

  const label = kind === "artist" ? "artist" : "influencer";

  async function uploadImage(file: File, uploadKind: UploadKind) {
    if (!file.type.startsWith("image/")) {
      throw new Error("Poți urca doar imagini.");
    }

    if (uploadKind === "portrait") setUploadingPortrait(true);
    if (uploadKind === "cover") setUploadingCover(true);

    try {
      const entitySlug = slugify(slug || name || item?.slug || item?.name || label);

      const presignResponse = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
          brandSlug: entitySlug,
          category: uploadKind === "portrait" ? `${label}-portrait` : `${label}-cover`,
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
        body: JSON.stringify({ objectKey }),
      });

      const publicData = await publicResponse.json().catch(() => ({}));

      if (!publicResponse.ok) {
        throw new Error(publicData?.error || "Imaginea a fost urcată, dar nu a putut fi făcută publică.");
      }

      if (uploadKind === "portrait") setPortraitImageUrl(finalUrl);
      if (uploadKind === "cover") setCoverImageUrl(finalUrl);
    } finally {
      if (uploadKind === "portrait") setUploadingPortrait(false);
      if (uploadKind === "cover") setUploadingCover(false);
    }
  }

  async function onFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
    uploadKind: UploadKind
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadImage(file, uploadKind);
      setMessage(uploadKind === "portrait" ? "Poza a fost urcată." : "Cover-ul a fost urcat.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      event.target.value = "";
    }
  }

  async function onDropFile(
    event: React.DragEvent<HTMLDivElement>,
    uploadKind: UploadKind
  ) {
    event.preventDefault();
    if (uploadKind === "portrait") setDragPortrait(false);
    if (uploadKind === "cover") setDragCover(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    try {
      await uploadImage(file, uploadKind);
      setMessage(uploadKind === "portrait" ? "Poza a fost urcată." : "Cover-ul a fost urcat.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const isEdit = mode === "edit" && item?.id;
      const url = isEdit ? `/api/admin/talents/${item.id}` : "/api/admin/talents";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          kind,
          portraitImageUrl,
          coverImageUrl,
          description,
          isVisible,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.error ||
            (isEdit ? `Nu s-a putut actualiza ${label}ul.` : `Nu s-a putut crea ${label}ul.`)
        );
      }

      if (mode === "create") {
        setName("");
        setSlug("");
        setPortraitImageUrl("");
        setCoverImageUrl("");
        setDescription("");
        setIsVisible(true);
        setMessage(`${label[0].toUpperCase() + label.slice(1)} creat cu succes.`);
      } else {
        setMessage("Salvat cu succes.");
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
        <h2>{mode === "edit" ? `Edit ${label}` : `Create ${label}`}</h2>
      </div>

      <div className="admin-stack">
        <div className="admin-form-field">
          <label>Name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={`${label} name`}
            required
          />
        </div>

        <div className="admin-form-field">
          <label>Slug</label>
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder={`${label}-slug`}
            required
          />
        </div>

        <div className="admin-form-field">
          <label>Portrait image URL</label>
          <input
            value={portraitImageUrl}
            onChange={(event) => setPortraitImageUrl(event.target.value)}
            placeholder="https://..."
          />
        </div>

        <div
          className={`admin-dropzone ${dragPortrait ? "is-dragover" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragPortrait(true);
          }}
          onDragLeave={() => setDragPortrait(false)}
          onDrop={(event) => void onDropFile(event, "portrait")}
          onClick={() => portraitInputRef.current?.click()}
        >
          <input
            ref={portraitInputRef}
            type="file"
            accept="image/*"
            className="admin-dropzone-input"
            onChange={(event) => void onFileChange(event, "portrait")}
          />
          <div className="admin-dropzone-copy">
            <strong>{uploadingPortrait ? "Uploading portrait..." : "Drag & drop portrait here"}</strong>
            <span>or click to upload</span>
          </div>
        </div>

        {portraitImageUrl ? (
          <div className="admin-media-edit-preview">
            <img src={portraitImageUrl} alt={name || label} />
          </div>
        ) : null}

        <div className="admin-form-field">
          <label>Cover image URL</label>
          <input
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
            <span>or click to upload</span>
          </div>
        </div>

        {coverImageUrl ? (
          <div className="admin-media-edit-preview">
            <img src={coverImageUrl} alt={`${name || label} cover`} />
          </div>
        ) : null}

        <div className="admin-form-field">
          <label>Description</label>
          <textarea
            className="admin-textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={`Descriere ${label}`}
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
            disabled={loading || uploadingPortrait || uploadingCover}
          >
            {loading
              ? mode === "edit"
                ? "Saving..."
                : "Creating..."
              : mode === "edit"
                ? "Save changes"
                : `Create ${label}`}
          </button>
        </div>

        {message ? <p className="admin-helper-text">{message}</p> : null}
      </div>
    </form>
  );
}
