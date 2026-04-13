import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { getPublishedMediaByCategory, getPublishedMediaBySlug } from "@/lib/dashboard/queries";

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

  const allVideos = await getPublishedMediaByCategory("video");

  const sameBrandVideos = allVideos.filter(
    (video) =>
      video.id !== item.id &&
      item.brandId &&
      video.brandId === item.brandId
  );

  const otherVideos = allVideos.filter(
    (video) =>
      video.id !== item.id &&
      (!item.brandId || video.brandId !== item.brandId)
  );

  return (
    <main className="inner-page">
      <section className="inner-section">
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

      {sameBrandVideos.length > 0 ? (
        <section className="inner-section">
          <div className="section-mini-head">
            <h2>Alte video de la acest brand</h2>
          </div>

          <PublicGrid dense>
            {sameBrandVideos.map((video) => (
              <PublicCard
                key={video.id}
                title={video.title}
                href={`/video/${video.slug}`}
                imageUrl={video.thumbnailUrl || video.previewUrl || video.fileUrl}
                imageOnly
              />
            ))}
          </PublicGrid>
        </section>
      ) : null}

      {otherVideos.length > 0 ? (
        <section className="inner-section">
          <div className="section-mini-head">
            <h2>Alte video</h2>
          </div>

          <PublicGrid dense>
            {otherVideos.map((video) => (
              <PublicCard
                key={video.id}
                title={video.title}
                href={`/video/${video.slug}`}
                imageUrl={video.thumbnailUrl || video.previewUrl || video.fileUrl}
                imageOnly
              />
            ))}
          </PublicGrid>
        </section>
      ) : null}
    </main>
  );
}
