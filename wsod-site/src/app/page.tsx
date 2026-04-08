import Link from "next/link";
import { featuredBrands, homeCategories } from "@/lib/data/home-data";
import { getAllBlogPosts } from "@/lib/data/blog-data";

export default function HomePage() {
  const latestPosts = getAllBlogPosts().slice(0, 3);

  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-logo-wrap">
          <div className="hero-logo">WSOD</div>
          <div className="hero-logo-sub">PROD</div>
        </div>

        <div className="hero-copy">
          <h1>AGENȚIE MEDIA DIGITALĂ &amp; VIDEO</h1>
        </div>
      </section>

      <section className="section">
        <div className="folder-grid">
          {homeCategories.map((service) => (
            <Link
              key={service.slug}
              href={`/${service.slug}`}
              className="folder-card"
            >
              <div className="folder-top" />
              <div className="folder-body">
                <span>{service.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section brands-section">
        <h2>BRANDS WE WORKED WITH</h2>

        <div className="brand-grid">
          {featuredBrands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brand/${brand.slug}`}
              className="brand-card"
            >
              <div className="folder-top" />
              <div className="folder-body brand-body">
                <span>{brand.name}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="dots">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="section home-blog-section">
        <div className="home-blog-head">
          <h2>BLOG</h2>
          <Link href="/blog" className="home-blog-link">
            Vezi toate articolele
          </Link>
        </div>

        <div className="blog-list">
          {latestPosts.map((post) => (
            <article key={post.slug} className="blog-card">
              <div className="blog-card-content">
                <span className="blog-date">
                  {new Date(post.publishedAt).toLocaleDateString("ro-RO")}
                </span>

                <h3>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p>{post.excerpt}</p>

                <Link href={`/blog/${post.slug}`} className="blog-read-more">
                  Citește articolul
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <a href="#">INSTA</a>
        <a href="#">YOUTUBE</a>
        <a href="#">TIKTOK</a>
        <a href="tel:+40727205689">+40727205689</a>
        <a href="#contact">CONTACT</a>
      </footer>
    </main>
  );
}