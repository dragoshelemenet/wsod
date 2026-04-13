import { Breadcrumbs } from "@/components/shared/breadcrumbs";
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

  return (
    <main className="inner-page">
      <section className="inner-section">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Branduri", href: "/brand" },
            { label: brand.title },
          ]}
        />
        <h1>{brand.title}</h1>
        <p className="inner-description">
          Pagina individuala pentru brand si proiectele sale publice.
        </p>

        <PublicGrid>
          {brand.mediaItems.map((item) => (
            <PublicCard
              key={item.id}
              title={item.title}
              subtitle={item.category}
              href={`/${item.category}/${item.slug}`}
              imageUrl={item.coverUrl || item.fileUrl}
            />
          ))}
        </PublicGrid>
      </section>
    </main>
  );
}
