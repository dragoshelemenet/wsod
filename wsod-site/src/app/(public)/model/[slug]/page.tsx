import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { MediaCarousel } from "@/components/public/media-carousel";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { getPublishedModelBySlug } from "@/lib/dashboard/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ModelSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const model = await getPublishedModelBySlug(slug);

  if (!model) {
    return (
      <main className="inner-page">
        <section className="inner-section">
          <h1>Model not found</h1>
          <p className="inner-description">Modelul nu a fost gasit.</p>
        </section>
      </main>
    );
  }

  const carouselItems = model.mediaItems.map((item) => ({
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
            { label: "Modele", href: "/model" },
            { label: model.name },
          ]}
        />

        <h1>{model.name}</h1>
        <p className="inner-description">
          {model.description || "Galerie pentru model si toate proiectele lui."}
        </p>

        <MediaCarousel items={carouselItems} />

        <PublicGrid dense>
          {model.mediaItems.map((item) => (
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
