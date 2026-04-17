import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { getPublishedMediaByCategory, getPublishedMediaBySlug } from "@/lib/dashboard/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function hasAiBadge(item: any) {
  return Boolean(item.aiMode || item.aiEdited);
}

function getAiBadgeLabel(item: any) {
  return hasAiBadge(item) ? "AI" : undefined;
}

function getAiBadgeTooltip(item: any) {
  return hasAiBadge(item) ? "Video complet generat cu AI." : undefined;
}

function getVideoRatio(item: any) {
  if (item.videoFormat === "wide-16x9") return "wide";
  if (item.videoFormat === "square-1x1") return "square";
  return "portrait";
}

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
    (video: any) =>
      video.id !== item.id &&
      item.brandId &&
      video.brandId === item.brandId
  );

  const otherVideos = allVideos.filter(
    (video: any) =>
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

        <div className="media-detail-hero media-detail-hero-video">
          <video
            src={item.fileUrl ?? undefined}
            controls
            playsInline
            className="media-detail-image"
          />
          {getAiBadgeLabel(item) ? (
            <span className="ai-photo-badge public-card-ai-badge" data-ai-tooltip={getAiBadgeTooltip(item)}>
              <span className="ai-photo-badge-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="ai-photo-badge-icon-svg">
                  <path d="M12 3l1.9 4.6L18.5 9l-4.6 1.4L12 15l-1.9-4.6L5.5 9l4.6-1.4L12 3z" fill="currentColor" />
                </svg>
              </span>
              <span className="ai-photo-badge-text">{getAiBadgeLabel(item)}</span>
            </span>
          ) : null}
        </div>
      </section>

      {sameBrandVideos.length > 0 ? (
        <section className="inner-section">
          <div className="section-mini-head">
            <h2>Alte video de la acest brand</h2>
          </div>

          <PublicGrid dense>
            {sameBrandVideos.map((video: any) => (
              <PublicCard
                key={video.id}
                title={video.title}
                href={`/video/${video.slug}`}
                imageUrl={video.thumbnailUrl || video.previewUrl || video.fileUrl}
                imageOnly
                showPlayIcon
                mediaRatio={getVideoRatio(video)}
                badgeLabel={getAiBadgeLabel(video)}
                badgeTooltip={getAiBadgeTooltip(video)}
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
            {otherVideos.map((video: any) => (
              <PublicCard
                key={video.id}
                title={video.title}
                href={`/video/${video.slug}`}
                imageUrl={video.thumbnailUrl || video.previewUrl || video.fileUrl}
                imageOnly
                showPlayIcon
                mediaRatio={getVideoRatio(video)}
                badgeLabel={getAiBadgeLabel(video)}
                badgeTooltip={getAiBadgeTooltip(video)}
              />
            ))}
          </PublicGrid>
        </section>
      ) : null}
    </main>
  );
}
