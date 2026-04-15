import Link from "next/link";
import { redirect } from "next/navigation";
import BlogPostEditor from "@/components/admin/BlogPostEditor";
import { hasAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function StudioDashboardBlogNewPage() {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    redirect("/studio-login");
  }

  const mediaItems = await prisma.mediaItem.findMany({
    orderBy: [{ updatedAt: "desc" }],
    take: 200,
    select: {
      id: true,
      title: true,
      category: true,
      type: true,
      fileUrl: true,
      previewUrl: true,
      thumbnailUrl: true,
    },
  });

  return (
    <main className="inner-page">
      <div className="inner-topbar admin-topbar">
        <Link href="/studio-dashboard/blog" className="back-link">
          ← Blog admin
        </Link>
      </div>

      <section className="inner-section admin-page-shell">
        <BlogPostEditor mode="create" mediaItems={mediaItems} />
      </section>
    </main>
  );
}
