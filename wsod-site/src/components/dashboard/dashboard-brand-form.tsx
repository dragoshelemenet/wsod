"use client";

import { useState } from "react";

export function DashboardBrandForm() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          logoUrl,
          coverImageUrl,
          description,
          isVisible,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Nu s-a putut crea brandul.");
      }

      setName("");
      setSlug("");
      setLogoUrl("");
      setCoverImageUrl("");
      setDescription("");
      setIsVisible(true);
      setMessage("Brand creat cu succes. Da refresh paginii.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscuta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <div className="admin-card-head">
        <h2>Create brand</h2>
      </div>

      <div className="admin-stack">
        <div className="admin-form-field">
          <label htmlFor="brand-name">Name</label>
          <input
            id="brand-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Brand name"
            required
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="brand-slug">Slug</label>
          <input
            id="brand-slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="brand-slug"
            required
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="brand-logo">Logo URL</label>
          <input
            id="brand-logo"
            value={logoUrl}
            onChange={(event) => setLogoUrl(event.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="brand-cover">Cover image URL</label>
          <input
            id="brand-cover"
            value={coverImageUrl}
            onChange={(event) => setCoverImageUrl(event.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="brand-description">Description</label>
          <textarea
            id="brand-description"
            className="admin-textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Descriere brand"
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
            {loading ? "Creating..." : "Create brand"}
          </button>
        </div>

        {message ? <p className="admin-helper-text">{message}</p> : null}
      </div>
    </form>
  );
}
