import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { MediaCarousel } from "@/components/public/media-carousel";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { getPublishedBrandBySlug } from "@/lib/dashboard/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BrandSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = await getPublishedBrandBySlug(slug);

  if (!brand) {
    return (
      <main className="inner-page">
        <section className="inner-section">
          <h1>Brand not found</h1>
          <p className="inner-description">Brandul nu a fost gasit.</p>
        </section>
      </main>
    );
  }

  const carouselItems = brand.mediaItems.map((item) => ({
    id: item.id,
    title: item.title,
    imageUrl: item.thumbnailUrl || item.previewUrl || item.fileUrl || null,
    href: `/${item.category}/${item.slug}`,
  }));

  return (
    <main className="inner-page">
      <section className="inner-section">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Branduri", href: "/brand" },
            { label: brand.name },
          ]}
        />

        <h1>{brand.name}</h1>
        <p className="inner-description">
          {brand.description || "Galerie pentru brand si toate proiectele lui."}
        </p>

        <MediaCarousel items={carouselItems} />

        <PublicGrid dense>
          {brand.mediaItems.map((item) => (
            <PublicCard
              key={item.id}
              title={item.title}
              href={`/${item.category}/${item.slug}`}
              imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
              imageOnly
            />
          ))}
        </PublicGrid>
      </section>
    </main>
  );
}
