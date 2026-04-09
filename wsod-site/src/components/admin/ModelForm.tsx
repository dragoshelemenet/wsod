"use client";

import { useState } from "react";

export default function ModelForm() {
  const [name, setName] = useState("");
  const [portraitImageUrl, setPortraitImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscută.");
    } finally {
      setIsSubmitting(false);
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
          <p className={message.includes("succes") ? "admin-success" : "admin-error"}>
            {message}
          </p>
        ) : null}

        <button type="submit" className="admin-submit" disabled={isSubmitting}>
          {isSubmitting ? "Se creează..." : "Creează model"}
        </button>
      </form>
    </div>
  );
}
