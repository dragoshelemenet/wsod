"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DashboardAudioProfileForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [kind, setKind] = useState("mix");
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
      const response = await fetch("/api/admin/audio-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          kind,
          coverImageUrl,
          description,
          isVisible,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Nu s-a putut crea audio profile.");
      }

      setName("");
      setSlug("");
      setKind("mix");
      setCoverImageUrl("");
      setDescription("");
      setIsVisible(true);
      setMessage("Audio profile creat cu succes.");
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
        <h2>Create audio profile</h2>
      </div>

      <div className="admin-stack">
        <div className="admin-form-field">
          <label htmlFor="audio-name">Name</label>
          <input
            id="audio-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Audio profile name"
            required
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="audio-slug">Slug</label>
          <input
            id="audio-slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="audio-profile-slug"
            required
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="audio-kind">Kind</label>
          <input
            id="audio-kind"
            value={kind}
            onChange={(event) => setKind(event.target.value)}
            placeholder="mix / master / cleanup"
            required
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="audio-cover">Cover image URL</label>
          <input
            id="audio-cover"
            value={coverImageUrl}
            onChange={(event) => setCoverImageUrl(event.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="audio-description">Description</label>
          <textarea
            id="audio-description"
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

        <div className="site-content-actions">
          <button className="admin-submit" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create audio profile"}
          </button>
        </div>

        {message ? <p className="admin-helper-text">{message}</p> : null}
      </div>
    </form>
  );
}
