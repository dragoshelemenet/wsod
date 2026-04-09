import Link from "next/link";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function StudioDashboardBlogPage() {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    redirect("/studio-login");
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      mediaLinks: {
        include: {
          mediaItem: true,
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return (
    <main className="inner-page">
      <div className="inner-topbar admin-topbar">
        <Link href="/studio-dashboard" className="back-link">
          ← Dashboard
        </Link>

        <Link href="/studio-dashboard/blog/new" className="admin-submit">
          Articol nou
        </Link>
      </div>

      <section className="inner-section admin-page-shell">
        <div className="admin-page-header">
          <span className="admin-kicker">Admin</span>
          <h1>Blog</h1>
          <p className="inner-description">
            Editezi articolele vechi, adaugi articole noi și atașezi media existentă.
          </p>
        </div>

        <div className="admin-list">
          {posts.map((post) => (
            <div key={post.id} className="admin-list-item">
              <div className="admin-list-copy">
                <strong>{post.title}</strong>
                <span>slug: {post.slug}</span>
                <span>status: {post.status}</span>
                <span>
                  media atașată: {post.mediaLinks.length}
                </span>
              </div>

              <div className="admin-inline-actions">
                <Link href={`/studio-dashboard/blog/${post.id}`} className="admin-secondary-button">
                  Editează
                </Link>
                <Link href={`/blog/${post.slug}`} className="admin-ghost-button" target="_blank">
                  Vezi live
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
