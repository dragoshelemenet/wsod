import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import BlogPostEditor from "@/components/admin/BlogPostEditor";
import { hasAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

interface BlogEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudioDashboardBlogEditPage({
  params,
}: BlogEditPageProps) {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    redirect("/studio-login");
  }

  const { id } = await params;

  const [post, mediaItems] = await Promise.all([
    prisma.blogPost.findUnique({
      where: { id },
      include: {
        mediaLinks: {
          include: {
            mediaItem: true,
          },
          orderBy: { sortOrder: "asc" },
        },
      },
    }),
    prisma.mediaItem.findMany({
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
    }),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <main className="inner-page">
      <div className="inner-topbar admin-topbar">
        <Link href="/studio-dashboard/blog" className="back-link">
          ← Blog admin
        </Link>
      </div>

      <section className="inner-section admin-page-shell">
        <BlogPostEditor
          mode="edit"
          mediaItems={mediaItems}
          initialData={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            contentHtml: post.contentHtml,
            seoTitle: post.seoTitle,
            metaDescription: post.metaDescription,
            coverImageUrl: post.coverImageUrl,
            status: post.status,
            publishedAt: post.publishedAt?.toISOString() ?? null,
            mediaItemIds: post.mediaLinks.map((link) => link.mediaItemId),
          }}
        />
      </section>
    </main>
  );
}
