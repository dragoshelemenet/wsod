import Hero from "@/components/home/Hero";
import ServiceFolders from "@/components/home/ServiceFolders";
import HomeServicesCarousel from "@/components/home/HomeServicesCarousel";
import HomeBlogSection from "@/components/home/HomeBlogSection";
import OwnerFolderGrid from "@/components/media/OwnerFolderGrid";
import { getBrandsWithHomePreviewFromDb } from "@/lib/data/db-queries";
import { getSiteContentFromDb } from "@/lib/data/site-content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const brands = await getBrandsWithHomePreviewFromDb();
  const content = await getSiteContentFromDb();

  const contactHref = content.contactHref || "https://wa.me/40727205689";
  const claimHref =
    content.claimHref ||
    "https://wa.me/40727205689?text=Salut%2C%20vreau%20primul%20video%20sau%20foto%20gratis";

  return (
    <main className="home-page">
      <Hero />
      <HomeServicesCarousel />

      <section className="section home-after-carousel-copy">
        <p className="home-after-carousel-text">
          Te ajutăm cu video, foto, design, website-uri și content pentru social media.
        </p>

        <div className="home-after-carousel-actions">
          <a href="/servicii-preturi" className="hero-quick-link">
            Servicii & prețuri
          </a>

          <a href={contactHref} className="hero-quick-link">
            {content.contactLabel || "Contact"}
          </a>

          <a href={claimHref} className="hero-quick-link hero-quick-link-primary">
            {content.claimLabel || "Primul video/foto gratis"}
          </a>
        </div>
      </section>

      <ServiceFolders />

      <section className="section brands-section">
        <div className="brands-section-copy">
          <p className="brands-section-kicker">Vezi portofoliul nostru:</p>
        </div>

        <OwnerFolderGrid
          title="Brandurile cu care am lucrat"
          ownerType="brand"
          items={brands.map((brand) => ({
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            imageUrl:
              brand.logoUrl ?? brand.coverImageUrl ?? brand.previewImages?.[0] ?? null,
            previewImages: brand.previewImages ?? [],
            href: `/brand/${brand.slug}`,
          }))}
          emptyText="Nu există branduri momentan."
          variant="compact-file"
        />
      </section>

      <HomeBlogSection />
    </main>
  );
}
