import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getPublishedMediaBySlug } from "@/lib/dashboard/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AudioSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getPublishedMediaBySlug(slug);

  if (!item) {
    return (
      <main className="inner-page">
        <section className="inner-section">
          <h1>Audio not found</h1>
          <p className="inner-description">Proiectul audio nu a fost gasit.</p>
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
            { label: "Audio", href: "/audio" },
            { label: item.title },
          ]}
        />
        <h1>{item.title}</h1>
        <p className="inner-description">
          {item.description || "Pagina individuala pentru proiect audio."}
        </p>

        {item.fileUrl ? (
          <div className="media-detail-hero">
            <p className="inner-description">Main audio</p>
            <audio src={item.fileUrl} controls style={{ width: "100%" }} />
          </div>
        ) : null}

        {item.previewUrl ? (
          <div className="media-detail-hero">
            <p className="inner-description">Preview</p>
            <audio src={item.previewUrl} controls style={{ width: "100%" }} />
          </div>
        ) : null}
      </section>
    </main>
  );
}
