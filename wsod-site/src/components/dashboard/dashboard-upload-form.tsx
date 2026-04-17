"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { uploadToSpaces } from "@/lib/uploads/upload-to-spaces";

type UploadItem = {
  id: string;
  file: File;
  title: string;
  slug: string;
  fileUrl: string;
  thumbnailUrl: string;
  previewUrl: string;
  thumbnailFile: File | null;
  status: "pending" | "uploading" | "uploaded" | "creating" | "done" | "error";
  error: string;
};

type BrandOption = {
  id: string;
  name: string;
  slug: string;
};

type DashboardUploadFormProps = {
  brands: BrandOption[];
};

function getTypeFromCategory(category: string) {
  if (category === "video") return "video";
  if (category === "audio") return "audio";
  if (category === "website") return "website";
  return "image";
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getBaseName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "").trim();
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function DashboardUploadForm({ brands }: DashboardUploadFormProps) {
  const router = useRouter();

  const [brandSlug, setBrandSlug] = useState(brands[0]?.slug ?? "");
  const [category, setCategory] = useState("foto");
  const [graphicKind, setGraphicKind] = useState("");
  const [videoKind, setVideoKind] = useState("");
  const [videoFormat, setVideoFormat] = useState("portrait-9x16");
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [aiMode, setAiMode] = useState("");

  const [audioOriginalTitle, setAudioOriginalTitle] = useState("");
  const [audioOriginalSlug, setAudioOriginalSlug] = useState("");
  const [audioProcessedTitle, setAudioProcessedTitle] = useState("");
  const [audioProcessedSlug, setAudioProcessedSlug] = useState("");
  const [audioOriginalFile, setAudioOriginalFile] = useState<File | null>(null);
  const [audioProcessedFile, setAudioProcessedFile] = useState<File | null>(null);
  const [audioOriginalUrl, setAudioOriginalUrl] = useState("");
  const [audioProcessedUrl, setAudioProcessedUrl] = useState("");

  const [items, setItems] = useState<UploadItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [message, setMessage] = useState("");

  const type = useMemo(() => getTypeFromCategory(category), [category]);
  const isAudio = category === "audio";
  const isGrafica = category === "grafica";
  const isVideo = category === "video";

  const acceptValue = useMemo(() => {
    if (type === "image") return "image/*";
    if (type === "video") return "video/*";
    if (type === "audio") return "audio/*";
    return "*/*";
  }, [type]);

  function updateItem(id: string, patch: Partial<UploadItem>) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  }

  function addFiles(fileList: FileList | File[]) {
    const incoming = Array.from(fileList);

    if (!incoming.length) return;

    const nextItems = incoming.map((file) => {
      const title = getBaseName(file.name) || "media item";
      return {
        id: createId(),
        file,
        title,
        slug: slugify(title),
        fileUrl: "",
        thumbnailUrl: "",
        previewUrl: "",
        thumbnailFile: null,
        status: "pending" as const,
        error: "",
      };
    });

    setItems((current) => [...current, ...nextItems]);
  }

  async function uploadSingleFile(file: File, currentCategory: string) {
    return uploadToSpaces({
      file,
      brandSlug,
      category: currentCategory,
    });
  }

  async function handleUploadAndCreateAll() {
    if (!brandSlug) {
      setMessage("Selectează brandul.");
      return;
    }

    if (isGrafica && !graphicKind) {
      setMessage("Selectează tipul materialului grafic.");
      return;
    }

    if (!items.length) {
      setMessage("Adauga fisiere mai intai.");
      return;
    }

    setUploading(true);
    setCreating(true);
    setMessage("");

    let successCount = 0;
    let failCount = 0;

    try {
      for (const item of items) {
        updateItem(item.id, { status: "uploading", error: "" });

        try {
          const uploadedMain = await uploadSingleFile(item.file, category);

          const patch: Partial<UploadItem> = {
            fileUrl: uploadedMain.url,
            status: "uploaded",
          };

          if (type === "image") {
            patch.thumbnailUrl = uploadedMain.url;
          }

          if (type === "video") {
            patch.previewUrl = uploadedMain.url;

            if (item.thumbnailFile) {
              const uploadedThumb = await uploadSingleFile(item.thumbnailFile, "video");
              patch.thumbnailUrl = uploadedThumb.url;
            }
          }

          updateItem(item.id, patch);
          updateItem(item.id, { status: "creating" });

          const response = await fetch("/api/admin/media", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ownerType: "brand",
              brandSlug,
              title: item.title,
              slug: item.slug,
              category,
              type,
              graphicKind: isGrafica ? graphicKind : "",
              videoKind: isVideo ? videoKind : "",
              videoFormat: isVideo ? videoFormat : "",
              date: new Date().toISOString(),
              fileUrl: patch.fileUrl || "",
              thumbnailUrl: patch.thumbnailUrl || "",
              previewUrl: patch.previewUrl || "",
              description,
              isVisible,
              isFeatured,
              aiEdited: !!aiMode,
              aiMode,
              fileNameOriginal: item.file.name,
            }),
          });

          const data = await response.json().catch(() => null);

          if (!response.ok) {
            throw new Error(data?.message || data?.error || "Nu s-a putut crea media item.");
          }

          updateItem(item.id, { status: "done", error: "" });
          successCount += 1;
        } catch (error) {
          updateItem(item.id, {
            status: "error",
            error: error instanceof Error ? error.message : "Eroare necunoscuta",
          });
          failCount += 1;
        }
      }

      setMessage(`Upload + create finished: ${successCount} ok, ${failCount} failed.`);
      router.refresh();
    } finally {
      setUploading(false);
      setCreating(false);
    }
  }

  async function handleUploadAudio(which: "original" | "processed") {
    const file = which === "original" ? audioOriginalFile : audioProcessedFile;

    if (!brandSlug) {
      setMessage("Selectează brandul.");
      return;
    }

    if (!file) {
      setMessage(which === "original" ? "Alege audio original." : "Alege audio procesat.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const uploaded = await uploadSingleFile(file, "audio");

      if (which === "original") {
        setAudioOriginalUrl(uploaded.url);
        if (!audioOriginalTitle) {
          const base = getBaseName(file.name) || "audio-original";
          setAudioOriginalTitle(base);
          setAudioOriginalSlug(slugify(base));
        }
      } else {
        setAudioProcessedUrl(uploaded.url);
        if (!audioProcessedTitle) {
          const base = getBaseName(file.name) || "audio-procesat";
          setAudioProcessedTitle(base);
          setAudioProcessedSlug(slugify(base));
        }
      }

      setMessage("Audio uploadat cu succes.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare upload audio.");
    } finally {
      setUploading(false);
    }
  }

  async function handleCreateAudioPair(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!brandSlug) {
      setMessage("Selectează brandul.");
      return;
    }

    if (!audioOriginalUrl || !audioProcessedUrl) {
      setMessage("Incarca si originalul si varianta procesata.");
      return;
    }

    setCreating(true);
    setMessage("");

    try {
      const originalResponse = await fetch("/api/admin/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerType: "brand",
          brandSlug,
          videoKind: "",
          title: audioOriginalTitle || "Audio original",
          slug: audioOriginalSlug || slugify(audioOriginalTitle || "audio-original"),
          category: "audio",
          type: "audio",
          date: new Date().toISOString(),
          fileUrl: audioOriginalUrl,
          previewUrl: audioProcessedUrl,
          description,
          isVisible,
          isFeatured,
          aiEdited: !!aiMode,
          aiMode,
          fileNameOriginal: audioOriginalFile?.name || "",
        }),
      });

      const originalData = await originalResponse.json().catch(() => null);

      if (!originalResponse.ok) {
        throw new Error(
          originalData?.message || originalData?.error || "Nu s-a putut crea itemul audio."
        );
      }

      setAudioOriginalTitle("");
      setAudioOriginalSlug("");
      setAudioProcessedTitle("");
      setAudioProcessedSlug("");
      setAudioOriginalFile(null);
      setAudioProcessedFile(null);
      setAudioOriginalUrl("");
      setAudioProcessedUrl("");
      setDescription("");
      setIsVisible(true);
      setIsFeatured(false);
      setAiMode("");
      setMessage("Audio media item creat cu succes.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscuta.");
    } finally {
      setCreating(false);
    }
  }

  const canRunAll =
    items.length > 0 &&
    !!brandSlug &&
    (!isGrafica || !!graphicKind) &&
    !uploading &&
    !creating;

  return (
    <div className="admin-form">
      <div className="admin-card-head">
        <h2>Create media item</h2>
      </div>

      <div className="admin-stack">
        <div className="admin-form-field">
          <label htmlFor="media-brand">Brand</label>
          <select
            id="media-brand"
            className="admin-select"
            value={brandSlug}
            onChange={(event) => {
              setBrandSlug(event.target.value);
              setMessage("");
            }}
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
          <label htmlFor="media-category">Category</label>
          <select
            id="media-category"
            className="admin-select"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setMessage("");
              if (event.target.value !== "grafica") {
                setGraphicKind("");
              }
              if (event.target.value !== "video") {
                setVideoKind("");
                setVideoFormat("portrait-9x16");
              }
              if (!["foto", "video"].includes(event.target.value)) {
                setAiMode("");
              }
            }}
          >
            <option value="foto">Foto</option>
            <option value="video">Video</option>
            <option value="grafica">Grafica</option>
            <option value="website">Website</option>
            <option value="meta-ads">Meta Ads</option>
            <option value="audio">Audio</option>
          </select>
        </div>

        {isGrafica ? (
          <div className="admin-form-field">
            <label htmlFor="media-graphic-kind">Tip material grafic</label>
            <select
              id="media-graphic-kind"
              className="admin-select"
              value={graphicKind}
              onChange={(event) => {
                setGraphicKind(event.target.value);
                setMessage("");
              }}
              required
            >
              <option value="">Selectează tipul</option>
              <option value="flyer">Flyer</option>
              <option value="carte-vizita">Carte de vizita</option>
              <option value="certificat">Certificat</option>
              <option value="poster">Poster</option>
              <option value="banner">Banner</option>
              <option value="meniu">Meniu</option>
              <option value="ambalaj">Ambalaj</option>
              <option value="eticheta">Eticheta</option>
              <option value="social-media">Social media</option>
              <option value="logo">Logo</option>
              <option value="altul">Altul</option>
            </select>
          </div>
        ) : null}

        {isVideo ? (
          <div className="admin-form-field">
            <label htmlFor="media-video-kind">Tip video</label>
            <select
              id="media-video-kind"
              className="admin-select"
              value={videoKind}
              onChange={(event) => {
                setVideoKind(event.target.value);
                setMessage("");
              }}
            >
              <option value="">Video normal</option>
              <option value="lyrics">Videoclip cu versuri</option>
            </select>
          </div>
        ) : null}

        {isVideo ? (
          <div className="admin-form-field">
            <label htmlFor="media-video-format">Format video</label>
            <select
              id="media-video-format"
              className="admin-select"
              value={videoFormat}
              onChange={(event) => {
                setVideoFormat(event.target.value);
                setMessage("");
              }}
            >
              <option value="portrait-9x16">9:16</option>
              <option value="wide-16x9">16:9</option>
              <option value="square-1x1">1:1</option>
            </select>
          </div>
        ) : null}

        {category === "audio" ? (
          <form className="admin-stack" onSubmit={handleCreateAudioPair}>
            <div className="admin-upload-box">
              <div className="admin-form-field">
                <label htmlFor="audio-original-title">Titlu audio original</label>
                <input
                  id="audio-original-title"
                  value={audioOriginalTitle}
                  onChange={(event) => {
                    const value = event.target.value;
                    setAudioOriginalTitle(value);
                    setAudioOriginalSlug(slugify(value));
                  }}
                  placeholder="Original"
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="audio-original-slug">Slug original</label>
                <input
                  id="audio-original-slug"
                  value={audioOriginalSlug}
                  onChange={(event) => setAudioOriginalSlug(slugify(event.target.value))}
                  placeholder="audio-original"
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="audio-original-file">Audio original</label>
                <input
                  id="audio-original-file"
                  type="file"
                  accept="audio/*"
                  onChange={(event) => setAudioOriginalFile(event.target.files?.[0] || null)}
                />
              </div>

              <div className="site-content-actions">
                <button
                  className="admin-submit"
                  type="button"
                  onClick={() => handleUploadAudio("original")}
                  disabled={uploading || !audioOriginalFile || !brandSlug}
                >
                  {uploading ? "Uploading..." : "Upload original"}
                </button>
              </div>

              <div className="admin-form-field">
                <label>Audio original URL</label>
                <input
                  value={audioOriginalUrl}
                  onChange={(event) => setAudioOriginalUrl(event.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="admin-upload-box">
              <div className="admin-form-field">
                <label htmlFor="audio-processed-title">Titlu audio procesat</label>
                <input
                  id="audio-processed-title"
                  value={audioProcessedTitle}
                  onChange={(event) => {
                    const value = event.target.value;
                    setAudioProcessedTitle(value);
                    setAudioProcessedSlug(slugify(value));
                  }}
                  placeholder="Procesat"
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="audio-processed-slug">Slug procesat</label>
                <input
                  id="audio-processed-slug"
                  value={audioProcessedSlug}
                  onChange={(event) => setAudioProcessedSlug(slugify(event.target.value))}
                  placeholder="audio-procesat"
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="audio-processed-file">Audio procesat</label>
                <input
                  id="audio-processed-file"
                  type="file"
                  accept="audio/*"
                  onChange={(event) => setAudioProcessedFile(event.target.files?.[0] || null)}
                />
              </div>

              <div className="site-content-actions">
                <button
                  className="admin-submit"
                  type="button"
                  onClick={() => handleUploadAudio("processed")}
                  disabled={uploading || !audioProcessedFile || !brandSlug}
                >
                  {uploading ? "Uploading..." : "Upload processed"}
                </button>
              </div>

              <div className="admin-form-field">
                <label>Audio procesat URL</label>
                <input
                  value={audioProcessedUrl}
                  onChange={(event) => setAudioProcessedUrl(event.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="admin-form-field">
              <label htmlFor="media-description-audio">Description</label>
              <textarea
                id="media-description-audio"
                className="admin-textarea"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Comparatie intre varianta originala si varianta procesata."
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
              <button className="admin-submit" type="submit" disabled={creating || !brandSlug}>
                {creating ? "Creating..." : "Create audio media item"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div
              className={`admin-dropzone ${dragOver ? "is-dragover" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setDragOver(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setDragOver(false);
                if (event.dataTransfer.files?.length) {
                  addFiles(event.dataTransfer.files);
                }
              }}
            >
              <input
                className="admin-dropzone-input"
                type="file"
                accept={acceptValue}
                multiple
                onChange={(event) => {
                  if (event.target.files?.length) {
                    addFiles(event.target.files);
                    event.currentTarget.value = "";
                  }
                }}
              />
              <div className="admin-dropzone-copy">
                <strong>Drag & drop multiple files here</strong>
                <span>or click and select multiple files</span>
              </div>
            </div>

            {items.length ? (
              <div className="admin-stack">
                {items.map((item, index) => (
                  <div key={item.id} className="admin-list-item">
                    <div className="admin-form-field">
                      <label>File {index + 1}</label>
                      <input value={item.file.name} readOnly />
                    </div>

                    <div className="admin-form-field">
                      <label>Title</label>
                      <input
                        value={item.title}
                        onChange={(event) => {
                          const value = event.target.value;
                          updateItem(item.id, {
                            title: value,
                            slug: slugify(value),
                          });
                        }}
                      />
                    </div>

                    <div className="admin-form-field">
                      <label>Slug</label>
                      <input
                        value={item.slug}
                        onChange={(event) =>
                          updateItem(item.id, { slug: slugify(event.target.value) })
                        }
                      />
                    </div>

                    <div className="admin-form-field">
                      <label>Status</label>
                      <input
                        value={
                          item.status === "error" && item.error
                            ? `${item.status}: ${item.error}`
                            : item.status
                        }
                        readOnly
                      />
                    </div>

                    {isVideo ? (
                      <div className="admin-form-field">
                        <label>Thumbnail imagine pentru video</label>
                        <div className="admin-dropzone admin-dropzone-compact">
                          <input
                            className="admin-dropzone-input"
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              const file = event.target.files?.[0] || null;
                              updateItem(item.id, { thumbnailFile: file });
                              event.currentTarget.value = "";
                            }}
                          />
                          <div className="admin-dropzone-copy">
                            <strong>
                              {item.thumbnailFile ? item.thumbnailFile.name : "Drag & drop thumbnail aici"}
                            </strong>
                            <span>ori click și selectezi o imagine</span>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}

            <div className="admin-form-field">
              <label htmlFor="media-description">Description for all</label>
              <textarea
                id="media-description"
                className="admin-textarea"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Descriere comuna pentru toate itemurile create acum."
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

            {["foto", "video"].includes(category) ? (
              <div className="admin-form-field">
                <label htmlFor="media-ai-mode">AI tag</label>
                <select
                  id="media-ai-mode"
                  className="admin-select"
                  value={aiMode}
                  onChange={(event) => setAiMode(event.target.value)}
                >
                  <option value="">Fără AI tag</option>
                  <option value="ai">AI</option>
                  {category === "foto" ? <option value="ai-edit">AI EDIT</option> : null}
                </select>
              </div>
            ) : null}

            <div className="site-content-actions">
              <button
                className="admin-submit"
                type="button"
                onClick={handleUploadAndCreateAll}
                disabled={!canRunAll}
              >
                {uploading || creating ? "Processing..." : "Upload and create all media items"}
              </button>

              <button
                className="admin-ghost-button"
                type="button"
                onClick={() => {
                  setItems([]);
                  setMessage("");
                }}
                disabled={uploading || creating}
              >
                Clear list
              </button>
            </div>
          </>
        )}

        {message ? <p className="admin-helper-text">{message}</p> : null}
      </div>
    </div>
  );
}
