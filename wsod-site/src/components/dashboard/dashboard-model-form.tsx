"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DashboardModelForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [portraitImageUrl, setPortraitImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          portraitImageUrl,
          description,
          isVisible,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Nu s-a putut crea modelul.");
      }

      setName("");
      setSlug("");
      setPortraitImageUrl("");
      setDescription("");
      setIsVisible(true);
      setMessage("Model creat cu succes.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscuta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <div className="admin-card-head">
        <h2>Create model</h2>
      </div>

      <div className="admin-stack">
        <div className="admin-form-field">
          <label htmlFor="model-name">Name</label>
          <input
            id="model-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Model name"
            required
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="model-slug">Slug</label>
          <input
            id="model-slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="model-slug"
            required
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="model-portrait">Portrait image URL</label>
          <input
            id="model-portrait"
            value={portraitImageUrl}
            onChange={(event) => setPortraitImageUrl(event.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="model-description">Description</label>
          <textarea
            id="model-description"
            className="admin-textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Descriere model"
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
          <button className="admin-submit" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create model"}
          </button>
        </div>

        {message ? <p className="admin-helper-text">{message}</p> : null}
      </div>
    </form>
  );
}
