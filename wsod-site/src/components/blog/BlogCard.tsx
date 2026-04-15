import Link from "next/link";
import { BlogPost } from "@/lib/types";

interface BlogCardProps {
  post: BlogPost;
  headingLevel?: "h2" | "h3";
}

export default function BlogCard({
  post,
  headingLevel = "h2",
}: BlogCardProps) {
  const HeadingTag = headingLevel;

  return (
    <article className="blog-card">
      <div className="blog-card-content">
        <span className="blog-date">
          {new Date(post.publishedAt).toLocaleDateString("ro-RO")}
        </span>

        <HeadingTag>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </HeadingTag>

        <p>{post.excerpt}</p>

        <Link href={`/blog/${post.slug}`} className="blog-read-more">
          Citește articolul
        </Link>
      </div>
    </article>
  );
}