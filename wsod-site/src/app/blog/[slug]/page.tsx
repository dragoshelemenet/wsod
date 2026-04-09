import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBlogPostsFromDb, getBlogPostBySlugFromDb } from "@/lib/data/blog-db";
import { createBlogPostingSchema } from "@/lib/seo/schema";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPostsFromDb();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlugFromDb(slug);

  if (!post || post.status !== "published") {
    return {
      title: "Articol inexistent | WSOD.PROD",
    };
  }

  return {
    title: post.seoTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? "",
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt ?? "",
      url: `https://wsod.cloud/blog/${post.slug}`,
      siteName: "WSOD.PROD",
      locale: "ro_RO",
      type: "article",
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlugFromDb(slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  const blogSchema = createBlogPostingSchema({
    title: post.seoTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? "",
    url: `https://wsod.cloud/blog/${post.slug}`,
    datePublished: post.publishedAt?.toISOString() ?? post.createdAt.toISOString(),
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
          {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("ro-RO")}
        </span>

        <h1>{post.title}</h1>

        {post.coverImageUrl ? (
          <div className="media-detail-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImageUrl} alt={post.title} className="media-detail-image" />
          </div>
        ) : null}

        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {post.mediaLinks.length ? (
          <section className="owner-folder-section">
            <div className="owner-folder-section-head">
              <h2>Media atașată</h2>
            </div>

            <div className="media-grid">
              {post.mediaLinks.map((link) => {
                const media = link.mediaItem;
                const preview = media.thumbnailUrl || media.previewUrl || media.fileUrl || null;
                const href =
                  media.category === "foto"
                    ? `/foto/${media.slug}`
                    : media.category === "video"
                      ? `/video/${media.slug}`
                      : media.category === "grafica"
                        ? `/grafica/${media.slug}`
                        : media.category === "website"
                          ? `/website/${media.slug}`
                          : media.category === "meta-ads"
                            ? `/meta-ads/${media.slug}`
                            : media.category === "audio"
                              ? `/audio/${media.slug}`
                              : media.fileUrl || "#";

                return (
                  <Link key={link.id} href={href} className="media-card media-card-compact">
                    <div className="media-thumb">
                      <div className="media-thumb-inner">
                        {preview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={preview} alt={media.title} className="media-thumb-image" />
                        ) : (
                          <div className="media-thumb-fallback">{media.type.toUpperCase()}</div>
                        )}
                      </div>
                    </div>

                    <div className="media-copy">
                      <h3 className="media-title">{media.title}</h3>
                      <div className="media-meta">
                        <span>{media.category}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

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
