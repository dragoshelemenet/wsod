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

  const videos = items.filter((item) => item.category === "video");
  const photos = items.filter((item) => item.category === "foto");
  const graphics = items.filter((item) => item.category === "grafica");
  const websites = items.filter((item) => item.category === "website");
  const metaAds = items.filter((item) => item.category === "meta-ads");
  const audio = items.filter((item) => item.category === "audio");
  const rest = items.filter(
    (item) =>
      !["video", "foto", "grafica", "website", "meta-ads", "audio"].includes(
        item.category
      )
  );

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>{brand.name}</h1>
        <p className="inner-description">
          {brand.description || "Proiecte din portofoliul acestui brand."}
        </p>

        {videos.length > 0 ? (
          <section className="inner-section-block">
            <div className="section-mini-head">
              <h2>Video</h2>
            </div>

            <PublicGrid dense>
              {videos.map((item) => (
                <PublicCard
                  key={item.id}
                  title={item.title}
                  href={`/${item.category}/${item.slug}`}
                  imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
                  imageOnly
                  showPlayIcon
                  badgeLabel={item.aiMode === "ai-edit" ? "AI EDIT" : item.aiMode ? "AI" : undefined}
                  badgeTooltip={
                    item.aiMode === "ai-edit"
                      ? "Conținut editat cu AI."
                      : item.aiMode
                        ? "Conținut creat cu AI."
                        : undefined
                  }
                />
              ))}
            </PublicGrid>
          </section>
        ) : null}

        {photos.length > 0 ? (
          <section className="inner-section-block">
            <div className="section-mini-head">
              <h2>Poze</h2>
            </div>

            <PublicGrid dense>
              {photos.map((item) => (
                <PublicCard
                  key={item.id}
                  title={item.title}
                  href={`/${item.category}/${item.slug}`}
                  imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
                  imageOnly
                  badgeLabel={item.aiMode === "ai-edit" ? "AI EDIT" : item.aiMode ? "AI" : undefined}
                  badgeTooltip={
                    item.aiMode === "ai-edit"
                      ? "Fotografie editată cu AI."
                      : item.aiMode
                        ? "Fotografie creată cu AI."
                        : undefined
                  }
                />
              ))}
            </PublicGrid>
          </section>
        ) : null}

        {graphics.length > 0 ? (
          <section className="inner-section-block">
            <div className="section-mini-head">
              <h2>Grafica</h2>
            </div>

            <PublicGrid dense>
              {graphics.map((item) => (
                <PublicCard
                  key={item.id}
                  title={item.title}
                  href={`/${item.category}/${item.slug}`}
                  imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
                  imageOnly
                  imageFit="contain"
                  mediaRatio="wide"
                />
              ))}
            </PublicGrid>
          </section>
        ) : null}

        {websites.length > 0 ? (
          <section className="inner-section-block">
            <div className="section-mini-head">
              <h2>Website</h2>
            </div>

            <PublicGrid dense>
              {websites.map((item) => (
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
        ) : null}

        {metaAds.length > 0 ? (
          <section className="inner-section-block">
            <div className="section-mini-head">
              <h2>Meta Ads</h2>
            </div>

            <PublicGrid dense>
              {metaAds.map((item) => (
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
        ) : null}

        {audio.length > 0 ? (
          <section className="inner-section-block">
            <div className="section-mini-head">
              <h2>Audio</h2>
            </div>

            <PublicGrid dense>
              {audio.map((item) => (
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
        ) : null}

        {rest.length > 0 ? (
          <section className="inner-section-block">
            <div className="section-mini-head">
              <h2>Altele</h2>
            </div>

            <PublicGrid dense>
              {rest.map((item) => (
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
        ) : null}
      </section>
    </main>
  );
}
