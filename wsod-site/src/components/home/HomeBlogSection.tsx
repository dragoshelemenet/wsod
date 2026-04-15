import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import { getAllBlogPostsFromDb } from "@/lib/data/blog-db";

export default async function HomeBlogSection() {
  const latestPosts = (await getAllBlogPostsFromDb()).slice(0, 3);

  return (
    <section className="section home-blog-section">
      <div className="home-blog-head">
        <h2>BLOG</h2>
        <Link href="/blog" className="home-blog-link">
          Vezi toate articolele
        </Link>
      </div>

      <div className="blog-list">
        {latestPosts.map((post) => (
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
            headingLevel="h3"
          />
        ))}
      </div>
    </section>
  );
}
