import Link from "next/link";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import BlogAdminList from "./page";

export default async function StudioDashboardBlogPageServer() {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    redirect("/studio-login");
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      mediaLinks: {
        select: {
          id: true,
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
            Editezi articolele vechi, adaugi articole noi, atașezi media și poți șterge articolele existente.
          </p>
        </div>

        <BlogAdminList posts={posts} />
      </section>
    </main>
  );
}
