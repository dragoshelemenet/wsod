"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface BlogAdminItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  mediaLinks: { id: string }[];
}

interface BlogAdminListProps {
  posts: BlogAdminItem[];
}

export default function BlogAdminList({ posts }: BlogAdminListProps) {
  const router = useRouter();

  async function handleDelete(id: string, title: string) {
    const confirmed = window.confirm(`Ștergi articolul "${title}"?`);
    if (!confirmed) return;

    const response = await fetch(`/api/admin/blog/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      alert(result.message || "Nu s-a putut șterge articolul.");
      return;
    }

    router.refresh();
  }

  if (!posts.length) {
    return <p className="admin-helper-text">Nu există articole încă.</p>;
  }

  return (
    <div className="admin-list">
      {posts.map((post) => (
        <div key={post.id} className="admin-list-item">
          <div className="admin-list-copy">
            <strong>{post.title}</strong>
            <span>slug: {post.slug}</span>
            <span>status: {post.status}</span>
            <span>media atașată: {post.mediaLinks.length}</span>
          </div>

          <div className="admin-inline-actions">
            <Link
              href={`/studio-dashboard/blog/${post.id}`}
              className="admin-secondary-button"
            >
              Editează
            </Link>

            <Link
              href={`/blog/${post.slug}`}
              className="admin-ghost-button"
              target="_blank"
            >
              Vezi live
            </Link>

            <button
              type="button"
              className="admin-danger-button"
              onClick={() => handleDelete(post.id, post.title)}
            >
              Șterge
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
