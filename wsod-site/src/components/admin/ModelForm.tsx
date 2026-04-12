"use client";

import { useMemo, useState } from "react";

interface ModelListItem {
  id: string;
  name: string;
  slug: string;
  portraitImageUrl?: string | null;
  hoverPreview1?: string | null;
  hoverPreview2?: string | null;
  hoverPreview3?: string | null;
  description?: string | null;
  seoTitle?: string | null;
  metaDescription?: string | null;
  isVisible?: boolean;
  _count?: {
    mediaItems: number;
  };
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function presignAndUploadFile(file: File, modelSlug: string, category: string) {
  const presignResponse = await fetch("/api/uploads/presign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      modelSlug,
      category,
    }),
  });

  if (!presignResponse.ok) {
    throw new Error("Nu s-a putut genera URL-ul de upload pentru model.");
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
    throw new Error("Upload-ul imaginii către Spaces a eșuat.");
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
    throw new Error("Imaginea a fost urcată, dar nu a putut fi făcută publică.");
  }

  return { publicUrl };
}

export default function ModelForm({
  initialModels,
}: {
  initialModels: ModelListItem[];
}) {
  const [name, setName] = useState("");
  const [slugInput, setSlugInput] = useState("");
  const [portraitImageUrl, setPortraitImageUrl] = useState("");
  const [portraitFile, setPortraitFile] = useState<File | null>(null);
  const [hoverPreview1, setHoverPreview1] = useState("");
  const [hoverPreview2, setHoverPreview2] = useState("");
  const [hoverPreview3, setHoverPreview3] = useState("");
  const [hoverPreview1File, setHoverPreview1File] = useState<File | null>(null);
  const [hoverPreview2File, setHoverPreview2File] = useState<File | null>(null);
  const [hoverPreview3File, setHoverPreview3File] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [models, setModels] = useState<ModelListItem[]>(initialModels);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const normalizedSlug = useMemo(() => slugify(slugInput || name), [slugInput, name]);

  function patchModel(id: string, patch: Partial<ModelListItem>) {
    setModels((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setMessage("Numele modelului este obligatoriu.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      let finalPortraitImageUrl = portraitImageUrl.trim();
      let finalHoverPreview1 = hoverPreview1.trim();
      let finalHoverPreview2 = hoverPreview2.trim();
      let finalHoverPreview3 = hoverPreview3.trim();

      if (portraitFile) {
        const uploaded = await presignAndUploadFile(
          portraitFile,
          normalizedSlug,
          "model-portrait"
        );
        finalPortraitImageUrl = uploaded.publicUrl;
      }

      if (hoverPreview1File) {
        const uploaded = await presignAndUploadFile(
          hoverPreview1File,
          normalizedSlug,
          "model-hover-preview-1"
        );
        finalHoverPreview1 = uploaded.publicUrl;
      }

      if (hoverPreview2File) {
        const uploaded = await presignAndUploadFile(
          hoverPreview2File,
          normalizedSlug,
          "model-hover-preview-2"
        );
        finalHoverPreview2 = uploaded.publicUrl;
      }

      if (hoverPreview3File) {
        const uploaded = await presignAndUploadFile(
          hoverPreview3File,
          normalizedSlug,
          "model-hover-preview-3"
        );
        finalHoverPreview3 = uploaded.publicUrl;
      }

      const response = await fetch("/api/admin/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          portraitImageUrl: finalPortraitImageUrl,
          hoverPreview1: finalHoverPreview1,
          hoverPreview2: finalHoverPreview2,
          hoverPreview3: finalHoverPreview3,
          description,
          seoTitle,
          metaDescription,
        }),
      });

      const result = (await response.json()) as {
        ok: boolean;
        message: string;
        personModel?: ModelListItem;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Nu s-a putut crea modelul.");
      }

      setMessage("Model creat cu succes.");
      setName("");
      setSlugInput("");
      setPortraitImageUrl("");
      setPortraitFile(null);
      setHoverPreview1("");
      setHoverPreview2("");
      setHoverPreview3("");
      setHoverPreview1File(null);
      setHoverPreview2File(null);
      setHoverPreview3File(null);
      setDescription("");
      setSeoTitle("");
      setMetaDescription("");

      if (result.personModel?.id) {
        setModels((current) => [
          {
            ...result.personModel,
            _count: { mediaItems: 0 },
          },
          ...current,
        ]);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscută.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveModel(
    model: ModelListItem,
    files?: {
      portraitFile?: File | null;
      hoverPreview1File?: File | null;
      hoverPreview2File?: File | null;
      hoverPreview3File?: File | null;
    }
  ) {
    try {
      setSavingId(model.id);
      setMessage("");

      let finalPortraitImageUrl = model.portraitImageUrl || "";
      let finalHoverPreview1 = model.hoverPreview1 || "";
      let finalHoverPreview2 = model.hoverPreview2 || "";
      let finalHoverPreview3 = model.hoverPreview3 || "";

      if (files?.portraitFile) {
        const uploaded = await presignAndUploadFile(
          files.portraitFile,
          model.slug,
          "model-portrait"
        );
        finalPortraitImageUrl = uploaded.publicUrl;
      }

      if (files?.hoverPreview1File) {
        const uploaded = await presignAndUploadFile(
          files.hoverPreview1File,
          model.slug,
          "model-hover-preview-1"
        );
        finalHoverPreview1 = uploaded.publicUrl;
      }

      if (files?.hoverPreview2File) {
        const uploaded = await presignAndUploadFile(
          files.hoverPreview2File,
          model.slug,
          "model-hover-preview-2"
        );
        finalHoverPreview2 = uploaded.publicUrl;
      }

      if (files?.hoverPreview3File) {
        const uploaded = await presignAndUploadFile(
          files.hoverPreview3File,
          model.slug,
          "model-hover-preview-3"
        );
        finalHoverPreview3 = uploaded.publicUrl;
      }

      const response = await fetch(`/api/admin/models/${model.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: model.name,
          slug: model.slug,
          portraitImageUrl: finalPortraitImageUrl,
          hoverPreview1: finalHoverPreview1,
          hoverPreview2: finalHoverPreview2,
          hoverPreview3: finalHoverPreview3,
          description: model.description || "",
          seoTitle: model.seoTitle || "",
          metaDescription: model.metaDescription || "",
          isVisible: !!model.isVisible,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Nu s-a putut salva modelul.");
      }

      patchModel(model.id, {
        portraitImageUrl: finalPortraitImageUrl,
        hoverPreview1: finalHoverPreview1,
        hoverPreview2: finalHoverPreview2,
        hoverPreview3: finalHoverPreview3,
      });

      setMessage("Model actualizat.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscută.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(model: ModelListItem) {
    const confirmed = window.confirm(`Ștergi modelul "${model.name}"?`);
    if (!confirmed) return;

    try {
      setDeletingId(model.id);
      setMessage("");

      const response = await fetch("/api/admin/models", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: model.id,
        }),
      });

      const result = (await response.json()) as {
        ok: boolean;
        message: string;
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Nu s-a putut șterge modelul.");
      }

      setModels((current) => current.filter((entry) => entry.id !== model.id));
      setMessage("Model șters.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscută.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="admin-panel-card">
      <div className="admin-card-head">
        <h2>Model nou</h2>
      </div>

      <form className="admin-stack" onSubmit={handleSubmit}>
        <div className="admin-form-field">
          <label htmlFor="model-name">Nume model</label>
          <input
            id="model-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Alexandra X"
            required
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="model-slug">Slug</label>
          <input
            id="model-slug"
            value={slugInput}
            onChange={(e) => setSlugInput(e.target.value)}
            placeholder="Lasă gol pentru auto din nume"
          />
          <p className="admin-helper-text">
            Slug final: <strong>{normalizedSlug || "—"}</strong>
          </p>
        </div>

        <div className="admin-form-field">
          <label htmlFor="model-portrait-file">Portrait image</label>
          <input
            id="model-portrait-file"
            type="file"
            accept="image/*"
            onChange={(e) => setPortraitFile(e.target.files?.[0] ?? null)}
          />
          <input
            id="model-portrait"
            value={portraitImageUrl}
            onChange={(e) => setPortraitImageUrl(e.target.value)}
            placeholder="URL imagine reprezentativă"
          />
        </div>

        <div className="admin-form-field">
          <label>Hover preview 1</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setHoverPreview1File(e.target.files?.[0] ?? null)}
          />
          <input
            value={hoverPreview1}
            onChange={(e) => setHoverPreview1(e.target.value)}
            placeholder="URL hover preview 1"
          />
        </div>

        <div className="admin-form-field">
          <label>Hover preview 2</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setHoverPreview2File(e.target.files?.[0] ?? null)}
          />
          <input
            value={hoverPreview2}
            onChange={(e) => setHoverPreview2(e.target.value)}
            placeholder="URL hover preview 2"
          />
        </div>

        <div className="admin-form-field">
          <label>Hover preview 3</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setHoverPreview3File(e.target.files?.[0] ?? null)}
          />
          <input
            value={hoverPreview3}
            onChange={(e) => setHoverPreview3(e.target.value)}
            placeholder="URL hover preview 3"
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="model-description">Descriere</label>
          <textarea
            id="model-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="model-seo-title">SEO title</label>
          <input
            id="model-seo-title"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="model-meta-description">Meta description</label>
          <textarea
            id="model-meta-description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={3}
          />
        </div>

        {message ? (
          <p className={message.includes("succes") || message.includes("șters") || message.includes("actualizat") ? "admin-success" : "admin-error"}>
            {message}
          </p>
        ) : null}

        <button type="submit" className="admin-submit" disabled={isSubmitting}>
          {isSubmitting ? "Se creează..." : "Creează model"}
        </button>
      </form>

      <div className="admin-existing-models">
        <div className="admin-card-head">
          <h2>Modele existente</h2>
        </div>

        <div className="admin-model-list">
          {models.map((model) => (
            <EditableModelRow
              key={model.id}
              model={model}
              onPatch={(patch) => patchModel(model.id, patch)}
              onSave={saveModel}
              onDelete={handleDelete}
              isSaving={savingId === model.id}
              isDeleting={deletingId === model.id}
            />
          ))}

          {!models.length ? (
            <p className="admin-helper-text">Nu există modele.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function EditableModelRow({
  model,
  onPatch,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}: {
  model: ModelListItem;
  onPatch: (patch: Partial<ModelListItem>) => void;
  onSave: (
    model: ModelListItem,
    files?: {
      portraitFile?: File | null;
      hoverPreview1File?: File | null;
      hoverPreview2File?: File | null;
      hoverPreview3File?: File | null;
    }
  ) => Promise<void>;
  onDelete: (model: ModelListItem) => Promise<void>;
  isSaving: boolean;
  isDeleting: boolean;
}) {
  const [portraitFile, setPortraitFile] = useState<File | null>(null);
  const [hoverPreview1File, setHoverPreview1File] = useState<File | null>(null);
  const [hoverPreview2File, setHoverPreview2File] = useState<File | null>(null);
  const [hoverPreview3File, setHoverPreview3File] = useState<File | null>(null);

  return (
    <div className="admin-list-item admin-list-item-column">
      <div className="admin-media-edit-layout">
        <div className="admin-media-edit-preview">
          {model.portraitImageUrl ? (
            <img src={model.portraitImageUrl} alt={model.name} />
          ) : (
            <div className="media-thumb-fallback">MODEL</div>
          )}
        </div>

        <div className="admin-media-edit-form">
          <div className="admin-form-field">
            <label>Nume model</label>
            <input value={model.name} onChange={(e) => onPatch({ name: e.target.value })} />
          </div>

          <div className="admin-form-field">
            <label>Slug</label>
            <input value={model.slug} onChange={(e) => onPatch({ slug: e.target.value })} />
          </div>

          <div className="admin-form-field">
            <label>Portrait image URL</label>
            <input
              value={model.portraitImageUrl || ""}
              onChange={(e) => onPatch({ portraitImageUrl: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPortraitFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="admin-form-field">
            <label>Hover preview 1</label>
            <input
              value={model.hoverPreview1 || ""}
              onChange={(e) => onPatch({ hoverPreview1: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setHoverPreview1File(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="admin-form-field">
            <label>Hover preview 2</label>
            <input
              value={model.hoverPreview2 || ""}
              onChange={(e) => onPatch({ hoverPreview2: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setHoverPreview2File(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="admin-form-field">
            <label>Hover preview 3</label>
            <input
              value={model.hoverPreview3 || ""}
              onChange={(e) => onPatch({ hoverPreview3: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setHoverPreview3File(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="admin-form-field">
            <label>Descriere</label>
            <textarea
              rows={3}
              value={model.description || ""}
              onChange={(e) => onPatch({ description: e.target.value })}
            />
          </div>

          <div className="admin-form-field">
            <label>SEO title</label>
            <input
              value={model.seoTitle || ""}
              onChange={(e) => onPatch({ seoTitle: e.target.value })}
            />
          </div>

          <div className="admin-form-field">
            <label>Meta description</label>
            <textarea
              rows={3}
              value={model.metaDescription || ""}
              onChange={(e) => onPatch({ metaDescription: e.target.value })}
            />
          </div>

          <div className="admin-inline-actions">
            <button
              type="button"
              className="admin-danger-button"
              onClick={() =>
                onPatch({
                  portraitImageUrl: "",
                  hoverPreview1: "",
                  hoverPreview2: "",
                  hoverPreview3: "",
                })
              }
            >
              Șterge imaginile
            </button>
          </div>

          <label className="admin-checkbox-row">
            <input
              type="checkbox"
              checked={!!model.isVisible}
              onChange={(e) => onPatch({ isVisible: e.target.checked })}
            />
            <span>Vizibil pe site</span>
          </label>

          <div className="admin-inline-actions">
            <button
              type="button"
              className="admin-submit"
              onClick={() =>
                onSave(model, {
                  portraitFile,
                  hoverPreview1File,
                  hoverPreview2File,
                  hoverPreview3File,
                })
              }
              disabled={isSaving}
            >
              {isSaving ? "Se salvează..." : "Salvează model"}
            </button>

            <button
              type="button"
              className="admin-danger-button"
              onClick={() => onDelete(model)}
              disabled={isDeleting}
            >
              {isDeleting ? "Se șterge..." : "Șterge"}
            </button>
          </div>

          <p className="admin-helper-text">{model._count?.mediaItems ?? 0} fișiere</p>
        </div>
      </div>
    </div>
  );
}
