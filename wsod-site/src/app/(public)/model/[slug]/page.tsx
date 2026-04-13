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

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>{model.name}</h1>

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
