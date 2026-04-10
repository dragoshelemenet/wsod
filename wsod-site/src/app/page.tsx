import Hero from "@/components/home/Hero";
import ServiceFolders from "@/components/home/ServiceFolders";
import HomeBlogSection from "@/components/home/HomeBlogSection";
import OwnerFolderGrid from "@/components/media/OwnerFolderGrid";
import { getBrandsWithHomePreviewFromDb } from "@/lib/data/db-queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const brands = await getBrandsWithHomePreviewFromDb();

  return (
    <main className="home-page">
      <Hero />
      <ServiceFolders />

      <section className="section brands-section">
        <OwnerFolderGrid
          title="BRANDS WE WORKED WITH"
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
