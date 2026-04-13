import { getPublishedMediaBySlug } from "@/lib/dashboard/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function WebsiteSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getPublishedMediaBySlug(slug);

  if (!item) {
    return (
      <main className="inner-page">
        <section className="inner-section">
          <h1>Website not found</h1>
          <p className="inner-description">Proiectul website nu a fost gasit.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>{item.title}</h1>
        <p className="inner-description">
          {item.description || "Pagina individuala pentru proiect website."}
        </p>

        <div className="website-detail-square-wrap">
          <div className="website-detail-square">
            <iframe
              src={item.fileUrl ?? undefined}
              title={item.title}
              className="website-detail-frame"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
