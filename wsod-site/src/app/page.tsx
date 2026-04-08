import Hero from "@/components/home/Hero";
import ServiceFolders from "@/components/home/ServiceFolders";
import HomeBlogSection from "@/components/home/HomeBlogSection";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { getBrandsFromDb } from "@/lib/data/db-queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const brands = await getBrandsFromDb();

  return (
    <main className="home-page">
      <Hero />
      <ServiceFolders />

      <section className="section brands-section">
        <h2>BRANDS WE WORKED WITH</h2>

        <div className="brand-grid">
          {brands.map((brand) => (
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

      <HomeBlogSection />
      <Footer />
    </main>
  );
}