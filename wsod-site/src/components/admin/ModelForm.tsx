"use client";

import { useState } from "react";

interface ModelListItem {
  id: string;
  name: string;
  slug: string;
  portraitImageUrl?: string | null;
  _count?: {
    mediaItems: number;
  };
}

export default function ModelForm({
  initialModels,
}: {
  initialModels: ModelListItem[];
}) {
  const [name, setName] = useState("");
  const [portraitImageUrl, setPortraitImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [models, setModels] = useState<ModelListItem[]>(initialModels);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setMessage("Numele modelului este obligatoriu.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      const response = await fetch("/api/admin/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          portraitImageUrl,
          description,
          seoTitle,
          metaDescription,
        }),
      });

      const result = (await response.json()) as {
        ok: boolean;
        message: string;
        personModel?: {
          id: string;
          name: string;
          slug: string;
          portraitImageUrl?: string | null;
        };
      };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Nu s-a putut crea modelul.");
      }

      setMessage("Model creat cu succes.");
      setName("");
      setPortraitImageUrl("");
      setDescription("");
      setSeoTitle("");
      setMetaDescription("");

      if (
        result.personModel &&
        result.personModel.id &&
        result.personModel.name &&
        result.personModel.slug
      ) {
        const newModel: ModelListItem = {
          id: result.personModel.id,
          name: result.personModel.name,
          slug: result.personModel.slug,
          portraitImageUrl: result.personModel.portraitImageUrl || null,
          _count: { mediaItems: 0 },
        };

        setModels((current) => [newModel, ...current]);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscută.");
    } finally {
      setIsSubmitting(false);
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
          <label htmlFor="model-portrait">Portrait image URL</label>
          <input
            id="model-portrait"
            value={portraitImageUrl}
            onChange={(e) => setPortraitImageUrl(e.target.value)}
            placeholder="URL imagine reprezentativă"
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
          <p className={message.includes("succes") || message.includes("șters") ? "admin-success" : "admin-error"}>
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
            <div key={model.id} className="admin-model-row">
              <div className="admin-model-row-left">
                <div className="admin-model-thumb">
                  {model.portraitImageUrl ? (
                    <img src={model.portraitImageUrl} alt={model.name} />
                  ) : (
                    <div className="media-thumb-fallback">MODEL</div>
                  )}
                </div>

                <div className="admin-model-copy">
                  <strong>{model.name}</strong>
                  <span>{model.slug}</span>
                  <span>{model._count?.mediaItems ?? 0} fișiere</span>
                </div>
              </div>

              <button
                type="button"
                className="admin-danger-button"
                onClick={() => handleDelete(model)}
                disabled={deletingId === model.id}
              >
                {deletingId === model.id ? "Se șterge..." : "Șterge"}
              </button>
            </div>
          ))}

          {!models.length ? (
            <p className="admin-helper-text">Nu există modele.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
