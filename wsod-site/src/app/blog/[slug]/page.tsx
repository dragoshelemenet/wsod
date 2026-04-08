import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/data/blog-data";
import { createBlogPostingSchema } from "@/lib/seo/schema";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Articol inexistent | WSOD.PROD",
    };
  }

  return {
    title: post.seoTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt,
      url: `https://example.com/blog/${post.slug}`,
      siteName: "WSOD.PROD",
      locale: "ro_RO",
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const blogSchema = createBlogPostingSchema({
    title: post.seoTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    url: `https://example.com/blog/${post.slug}`,
    datePublished: post.publishedAt,
  });

  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/blog" className="back-link">
          ← Înapoi la blog
        </Link>
      </div>

      <article className="inner-section blog-post">
        <span className="blog-date">
          {new Date(post.publishedAt).toLocaleDateString("ro-RO")}
        </span>

        <h1>{post.title}</h1>

        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogSchema),
          }}
        />
      </article>
    </main>
  );
}