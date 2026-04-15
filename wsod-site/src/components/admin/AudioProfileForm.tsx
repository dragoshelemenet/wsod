"use client";

import { useState } from "react";

export default function AudioProfileForm() {
  const [name, setName] = useState("");
  const [kind, setKind] = useState("artist");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setMessage("Numele profilului audio este obligatoriu.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      const response = await fetch("/api/admin/audio-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          kind,
          coverImageUrl,
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
        throw new Error(result.message || "Nu s-a putut crea profilul audio.");
      }

      setMessage("Profil audio creat cu succes.");
      setName("");
      setKind("artist");
      setCoverImageUrl("");
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
        <h2>Audio Profile nou</h2>
      </div>

      <form className="admin-stack" onSubmit={handleSubmit}>
        <div className="admin-form-field">
          <label htmlFor="audio-profile-name">Nume profil</label>
          <input
            id="audio-profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Cartier Talks"
            required
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="audio-profile-kind">Tip</label>
          <select
            id="audio-profile-kind"
            className="admin-select"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="artist">artist</option>
            <option value="podcast">podcast</option>
            <option value="show">show</option>
            <option value="project">project</option>
          </select>
        </div>

        <div className="admin-form-field">
          <label htmlFor="audio-profile-cover">Cover image URL</label>
          <input
            id="audio-profile-cover"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="URL cover"
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="audio-profile-description">Descriere</label>
          <textarea
            id="audio-profile-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="audio-profile-seo-title">SEO title</label>
          <input
            id="audio-profile-seo-title"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="audio-profile-meta-description">Meta description</label>
          <textarea
            id="audio-profile-meta-description"
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
          {isSubmitting ? "Se creează..." : "Creează audio profile"}
        </button>
      </form>
    </div>
  );
}
