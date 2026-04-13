import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getPublishedMediaBySlug } from "@/lib/dashboard/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function VideoSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getPublishedMediaBySlug(slug);

  if (!item) {
    return (
      <main className="inner-page">
        <section className="inner-section">
          <h1>Video not found</h1>
          <p className="inner-description">Proiectul video nu a fost gasit.</p>
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
            { label: "Video", href: "/video" },
            { label: item.title },
          ]}
        />
        <h1>{item.title}</h1>
        <p className="inner-description">
          {item.description || "Pagina individuala pentru proiect video."}
        </p>
        <div className="media-detail-hero">
          <video
            src={item.fileUrl ?? undefined}
            controls
            playsInline
            className="media-detail-image"
          />
        </div>
      </section>
    </main>
  );
}
