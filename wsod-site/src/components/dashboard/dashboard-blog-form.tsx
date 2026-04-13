"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DashboardBlogForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentHtml, setContentHtml] = useState("<p></p>");
  const [status, setStatus] = useState("draft");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          contentHtml,
          status,
          coverImageUrl,
          seoTitle,
          metaDescription,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Nu s-a putut crea articolul.");
      }

      setTitle("");
      setSlug("");
      setExcerpt("");
      setContentHtml("<p></p>");
      setStatus("draft");
      setCoverImageUrl("");
      setSeoTitle("");
      setMetaDescription("");
      setMessage("Articol creat cu succes.");
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
        <h2>Create blog post</h2>
      </div>

      <div className="admin-stack">
        <div className="admin-form-field">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="admin-form-field">
          <label>Slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>

        <div className="admin-form-field">
          <label>Excerpt</label>
          <textarea
            className="admin-textarea"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>

        <div className="admin-form-field">
          <label>Content HTML</label>
          <textarea
            className="admin-textarea"
            value={contentHtml}
            onChange={(e) => setContentHtml(e.target.value)}
          />
        </div>

        <div className="admin-form-field">
          <label>Status</label>
          <select
            className="admin-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="admin-form-field">
          <label>Cover Image URL</label>
          <input
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
          />
        </div>

        <div className="admin-form-field">
          <label>SEO Title</label>
          <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
        </div>

        <div className="admin-form-field">
          <label>Meta Description</label>
          <textarea
            className="admin-textarea"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
          />
        </div>

        <div className="site-content-actions">
          <button className="admin-submit" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create post"}
          </button>
        </div>

        {message ? <p className="admin-helper-text">{message}</p> : null}
      </div>
    </form>
  );
}
