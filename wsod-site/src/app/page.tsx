import Hero from "@/components/home/Hero";
import ServiceFolders from "@/components/home/ServiceFolders";
import HomeServicesCarousel from "@/components/home/HomeServicesCarousel";
import HomeBlogSection from "@/components/home/HomeBlogSection";
import OwnerFolderGrid from "@/components/media/OwnerFolderGrid";
import { getBrandsWithHomePreviewFromDb } from "@/lib/data/db-queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const brands = await getBrandsWithHomePreviewFromDb();

  return (
    <main className="home-page">
      <Hero />
      <HomeServicesCarousel />

      <section className="section home-after-carousel-copy">
        <p className="home-after-carousel-text">
          Te ajutăm cu video, foto, design, website-uri și content pentru social media.
        </p>
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
            imageUrl: brand.logoUrl ?? brand.coverImageUrl ?? brand.previewImages?.[0] ?? null,
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
