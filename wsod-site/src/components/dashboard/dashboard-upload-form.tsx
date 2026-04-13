"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type PresignResponse = {
  ok?: boolean;
  uploadUrl?: string;
  fileUrl?: string;
  publicUrl?: string;
  key?: string;
  fields?: Record<string, string>;
  error?: string;
};

export function DashboardUploadForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("foto");
  const [type, setType] = useState("image");
  const [fileUrl, setFileUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  const acceptValue = useMemo(() => {
    if (type === "image") return "image/*";
    if (type === "video") return "video/*";
    if (type === "audio") return "audio/*";
    return "*/*";
  }, [type]);

  async function handleDirectUpload() {
    if (!selectedFile) {
      setMessage("Alege mai intai un fisier.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const presignResponse = await fetch("/api/uploads/presign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: selectedFile.name,
          contentType: selectedFile.type || "application/octet-stream",
          category,
        }),
      });

      const presignData: PresignResponse = await presignResponse.json().catch(() => ({}));

      if (!presignResponse.ok) {
        throw new Error(presignData?.error || "Nu s-a putut genera presign URL.");
      }

      const uploadUrl = presignData.uploadUrl;
      const finalUrl =
        presignData.fileUrl || presignData.publicUrl || "";

      if (!uploadUrl || !finalUrl) {
        throw new Error("Raspuns invalid de la presign endpoint.");
      }

      const uploadResult = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type || "application/octet-stream",
        },
        body: selectedFile,
      });

      if (!uploadResult.ok) {
        throw new Error("Upload-ul fisierului a esuat.");
      }

      setFileUrl(finalUrl);

      if (type === "image" && !thumbnailUrl) {
        setThumbnailUrl(finalUrl);
      }

      if ((type === "video" || type === "audio") && !previewUrl) {
        setPreviewUrl(finalUrl);
      }

      setMessage("Fisier uploadat cu succes. Acum poti salva media item.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscuta la upload.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreating(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          category,
          type,
          date: new Date().toISOString(),
          fileUrl,
          thumbnailUrl,
          previewUrl,
          description,
          isVisible,
          isFeatured,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Nu s-a putut crea media item.");
      }

      setTitle("");
      setSlug("");
      setCategory("foto");
      setType("image");
      setFileUrl("");
      setThumbnailUrl("");
      setPreviewUrl("");
      setDescription("");
      setIsVisible(true);
      setIsFeatured(false);
      setSelectedFile(null);
      setMessage("Media item creat cu succes.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscuta.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <div className="admin-card-head">
        <h2>Create media item</h2>
      </div>

      <div className="admin-stack">
        <div className="admin-form-field">
          <label htmlFor="media-title">Title</label>
          <input
            id="media-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Titlu"
            required
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="media-slug">Slug</label>
          <input
            id="media-slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="media-item-slug"
            required
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="media-category">Category</label>
          <select
            id="media-category"
            className="admin-select"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="foto">Foto</option>
            <option value="video">Video</option>
            <option value="grafica">Grafica</option>
            <option value="website">Website</option>
            <option value="meta-ads">Meta Ads</option>
            <option value="audio">Audio</option>
          </select>
        </div>

        <div className="admin-form-field">
          <label htmlFor="media-type">Type</label>
          <select
            id="media-type"
            className="admin-select"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="website">Website</option>
          </select>
        </div>

        <div className="admin-form-field">
          <label htmlFor="media-file-input">Upload file</label>
          <input
            id="media-file-input"
            type="file"
            accept={acceptValue}
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              setSelectedFile(file);
            }}
          />
        </div>

        <div className="site-content-actions">
          <button
            className="admin-submit"
            type="button"
            onClick={handleDirectUpload}
            disabled={uploading || !selectedFile}
          >
            {uploading ? "Uploading..." : "Upload to Spaces"}
          </button>
        </div>

        <div className="admin-form-field">
          <label htmlFor="media-file-url">File URL</label>
          <input
            id="media-file-url"
            value={fileUrl}
            onChange={(event) => setFileUrl(event.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="media-thumb-url">Thumbnail URL</label>
          <input
            id="media-thumb-url"
            value={thumbnailUrl}
            onChange={(event) => setThumbnailUrl(event.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="media-preview-url">Preview URL</label>
          <input
            id="media-preview-url"
            value={previewUrl}
            onChange={(event) => setPreviewUrl(event.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="media-description">Description</label>
          <textarea
            id="media-description"
            className="admin-textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Descriere"
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

        <label className="admin-toggle-row">
          <span>Featured</span>
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(event) => setIsFeatured(event.target.checked)}
          />
        </label>

        <div className="site-content-actions">
          <button className="admin-submit" type="submit" disabled={creating}>
            {creating ? "Creating..." : "Create media item"}
          </button>
        </div>

        {message ? <p className="admin-helper-text">{message}</p> : null}
      </div>
    </form>
  );
}
