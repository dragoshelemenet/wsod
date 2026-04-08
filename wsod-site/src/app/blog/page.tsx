import Link from "next/link";
import { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/data/blog-data";
import BlogCard from "@/components/blog/BlogCard";

export const metadata: Metadata = {
  title: "Blog | WSOD.PROD",
  description:
    "Articole despre producție video, content social media, branding vizual și proiecte realizate în București.",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

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
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
}