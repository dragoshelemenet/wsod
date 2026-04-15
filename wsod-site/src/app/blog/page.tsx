import Link from "next/link";
import { Metadata } from "next";
import { getAllBlogPostsFromDb } from "@/lib/data/blog-db";
import BlogCard from "@/components/blog/BlogCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | WSOD.PROD",
  description:
    "Articole despre producție video, content social media, branding vizual și proiecte realizate în București.",
};

export default async function BlogPage() {
  const posts = await getAllBlogPostsFromDb();

  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>
      </div>

      <section className="inner-section">
        <h1>Blog</h1>
        <p className="inner-description">
          Articole SEO și pagini editoriale pentru producție video, content,
          branding și proiecte realizate în București.
        </p>

        <div className="blog-list">
          {posts.map((post) => (
            <BlogCard
              key={post.slug}
              post={{
                slug: post.slug,
                title: post.title,
                excerpt: post.excerpt || "",
                publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
                seoTitle: post.seoTitle || undefined,
                metaDescription: post.metaDescription || undefined,
                content: post.contentHtml,
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
