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

  const items = brand.mediaItems ?? [];

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>{brand.name}</h1>
        <p className="inner-description">
          {brand.description || "Proiecte din portofoliul acestui brand."}
        </p>

        <PublicGrid dense>
          {items.map((item) => (
            <PublicCard
              key={item.id}
              title={item.title}
              href={`/${item.category}/${item.slug}`}
              imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
              imageOnly
              showPlayIcon={item.category === "video"}
              rotation={item.rotation ?? 0}
            />
          ))}
        </PublicGrid>
      </section>
    </main>
  );
}
