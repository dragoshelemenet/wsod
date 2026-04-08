import Link from "next/link";
import { getAllBlogPosts } from "@/lib/data/blog-data";
import BlogCard from "@/components/blog/BlogCard";

export default function HomeBlogSection() {
  const latestPosts = getAllBlogPosts().slice(0, 3);

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
          <BlogCard key={post.slug} post={post} headingLevel="h3" />
        ))}
      </div>
    </section>
  );
}