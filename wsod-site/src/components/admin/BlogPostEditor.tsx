"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface AdminMediaOption {
  id: string;
  title: string;
  category: string;
  type: string;
  fileUrl?: string | null;
  previewUrl?: string | null;
  thumbnailUrl?: string | null;
}

interface InitialBlogPostData {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  contentHtml?: string;
  seoTitle?: string | null;
  metaDescription?: string | null;
  coverImageUrl?: string | null;
  status?: string;
  publishedAt?: string | null;
  mediaItemIds?: string[];
}

interface BlogPostEditorProps {
  mode: "create" | "edit";
  initialData?: InitialBlogPostData;
  mediaItems: AdminMediaOption[];
}

function getMediaPreview(item: AdminMediaOption) {
  return item.previewUrl || item.thumbnailUrl || item.fileUrl || "";
}

export default function BlogPostEditor({
  mode,
  initialData,
  mediaItems,
}: BlogPostEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [contentHtml, setContentHtml] = useState(initialData?.contentHtml ?? "");
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "draft");
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt ? initialData.publishedAt.slice(0, 10) : ""
  );
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>(
    initialData?.mediaItemIds ?? []
  );
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [filter, setFilter] = useState("");

  const filteredMedia = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return mediaItems;

    return mediaItems.filter((item) =>
      [item.title, item.category, item.type].some((value) =>
        value.toLowerCase().includes(q)
      )
    );
  }, [mediaItems, filter]);

  const attachedMedia = useMemo(
    () => mediaItems.filter((item) => selectedMediaIds.includes(item.id)),
    [mediaItems, selectedMediaIds]
  );

  function toggleMedia(id: string) {
    setSelectedMediaIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const payload = {
        title,
        slug,
        excerpt,
        contentHtml,
        seoTitle,
        metaDescription,
        coverImageUrl,
        status,
        publishedAt,
        mediaItemIds: selectedMediaIds,
      };

      const response =
        mode === "create"
          ? await fetch("/api/admin/blog", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
          : await fetch(`/api/admin/blog/${initialData?.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Nu s-a putut salva articolul.");
      }

      setMessage(mode === "create" ? "Articol creat." : "Articol actualizat.");
      router.push("/studio-dashboard/blog");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscută.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="admin-panel-card">
      <div className="admin-card-head">
        <h2>{mode === "create" ? "Articol nou" : "Editare articol"}</h2>
      </div>

      <form className="admin-stack" onSubmit={handleSubmit}>
        <div className="admin-form-field">
          <label htmlFor="blog-title">Titlu</label>
          <input
            id="blog-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="blog-slug">Slug opțional</label>
          <input
            id="blog-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="lasă gol pentru auto"
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="blog-excerpt">Excerpt</label>
          <textarea
            id="blog-excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="blog-content">Content HTML</label>
          <textarea
            id="blog-content"
            value={contentHtml}
            onChange={(e) => setContentHtml(e.target.value)}
            rows={16}
            required
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="blog-seo-title">SEO Title</label>
          <input
            id="blog-seo-title"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="blog-meta-description">Meta Description</label>
          <textarea
            id="blog-meta-description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="blog-cover-image">Cover image URL</label>
          <input
            id="blog-cover-image"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
          />
        </div>

        {coverImageUrl ? (
          <div className="admin-blog-cover-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImageUrl} alt="Cover preview" />
          </div>
        ) : null}

        <div className="admin-form-field">
          <label htmlFor="blog-status">Status</label>
          <select
            id="blog-status"
            className="admin-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </div>

        <div className="admin-form-field">
          <label htmlFor="blog-published-at">Published at</label>
          <input
            id="blog-published-at"
            type="date"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="blog-media-filter">Atașează media existentă</label>
          <input
            id="blog-media-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="caută după titlu / categorie"
          />
        </div>

        <div className="admin-media-picker">
          {filteredMedia.map((item) => {
            const preview = getMediaPreview(item);
            const checked = selectedMediaIds.includes(item.id);

            return (
              <label key={item.id} className={`admin-media-pick-card${checked ? " active" : ""}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleMedia(item.id)}
                />
                <div className="admin-media-pick-preview">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt={item.title} />
                  ) : (
                    <span>{item.type}</span>
                  )}
                </div>
                <div className="admin-media-pick-copy">
                  <strong>{item.title}</strong>
                  <span>{item.category}</span>
                </div>

                {preview ? (
                  <button
                    type="button"
                    className="admin-ghost-button"
                    onClick={(e) => {
                      e.preventDefault();
                      setCoverImageUrl(preview);
                    }}
                  >
                    Setează ca cover
                  </button>
                ) : null}
              </label>
            );
          })}
        </div>

        {attachedMedia.length ? (
          <div className="admin-stack">
            <div className="admin-card-head">
              <h2>Media atașată</h2>
            </div>

            <div className="admin-media-picker">
              {attachedMedia.map((item) => {
                const preview = getMediaPreview(item);

                return (
                  <div key={`attached-${item.id}`} className="admin-media-pick-card active">
                    <div className="admin-media-pick-preview">
                      {preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={preview} alt={item.title} />
                      ) : (
                        <span>{item.type}</span>
                      )}
                    </div>
                    <div className="admin-media-pick-copy">
                      <strong>{item.title}</strong>
                      <span>{item.category}</span>
                    </div>
                    {preview ? (
                      <button
                        type="button"
                        className="admin-submit"
                        onClick={() => setCoverImageUrl(preview)}
                      >
                        Folosește ca cover
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {message ? (
          <p className={message.includes("creat") || message.includes("actualizat") ? "admin-success" : "admin-error"}>
            {message}
          </p>
        ) : null}

        <button type="submit" className="admin-submit" disabled={isSaving}>
          {isSaving ? "Se salvează..." : mode === "create" ? "Creează articol" : "Salvează articolul"}
        </button>
      </form>
    </div>
  );
}
