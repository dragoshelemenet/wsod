import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getPublishedMediaBySlug } from "@/lib/dashboard/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MetaAdsSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getPublishedMediaBySlug(slug);

  if (!item) {
    return (
      <main className="inner-page">
        <section className="inner-section">
          <h1>Meta Ads not found</h1>
          <p className="inner-description">Proiectul Meta Ads nu a fost gasit.</p>
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
            { label: "Meta Ads", href: "/meta-ads" },
            { label: item.title },
          ]}
        />
        <h1>{item.title}</h1>
        <p className="inner-description">
          {item.excerpt || "Pagina individuala pentru proiect Meta Ads."}
        </p>
        <div className="media-detail-hero">
          <img
            src={item.fileUrl}
            alt={item.title}
            className="media-detail-image"
          />
        </div>
      </section>
    </main>
  );
}
