import { getHomepageCollections, getPublishedBrands } from "@/lib/dashboard/queries";

export default async function HomePage() {
  const data = await getHomepageCollections();
  const brands = await getPublishedBrands();

  const folders = [
    {
      title: "PHOTO",
      href: "/foto",
      imageUrl:
        data.foto[0]?.thumbnailUrl ||
        data.foto[0]?.previewUrl ||
        data.foto[0]?.fileUrl ||
        null,
      meta: `${data.foto.length} proiecte`,
    },
    {
      title: "VIDEO",
      href: "/video",
      imageUrl:
        data.video[0]?.thumbnailUrl ||
        data.video[0]?.previewUrl ||
        data.video[0]?.fileUrl ||
        null,
      meta: `${data.video.length} proiecte`,
    },
    {
      title: "AUDIO",
      href: "/audio",
      imageUrl:
        data.audio[0]?.thumbnailUrl ||
        data.audio[0]?.previewUrl ||
        data.audio[0]?.fileUrl ||
        null,
      meta: `${data.audio.length} proiecte`,
    },
    {
      title: "GRAPHICA",
      href: "/grafica",
      imageUrl:
        data.grafica[0]?.thumbnailUrl ||
        data.grafica[0]?.previewUrl ||
        data.grafica[0]?.fileUrl ||
        null,
      meta: "Flyere • Coveruri • Carti de vizita",
    },
    {
      title: "WEBSITE-URI",
      href: "/website",
      imageUrl:
        data.website[0]?.thumbnailUrl ||
        data.website[0]?.previewUrl ||
        data.website[0]?.fileUrl ||
        null,
      meta: `${data.website.length} proiecte`,
    },
    {
      title: "META ADS",
      href: "/meta-ads",
      imageUrl:
        data.metaAds[0]?.thumbnailUrl ||
        data.metaAds[0]?.previewUrl ||
        data.metaAds[0]?.fileUrl ||
        null,
      meta: `${data.metaAds.length} proiecte`,
    },
  ];

  const featuredBrands = brands.slice(0, 3);

  return (
    <main className="reference-home">
      <section className="reference-hero">
        <div className="reference-brand-mark">
          <div className="reference-logo-box">WSOD</div>
          <div className="reference-logo-sub">PROD</div>
        </div>

        <div className="reference-hero-copy">
          <h1>AGENTIE MEDIA DIGITALA &amp; VIDEO</h1>
        </div>
      </section>

      <section className="reference-folder-grid">
        {folders.map((folder) => (
          <a key={folder.href} href={folder.href} className="reference-folder-card">
            <div className="reference-folder-tab" />
            <div
              className="reference-folder-art"
              style={
                folder.imageUrl
                  ? { backgroundImage: `linear-gradient(rgba(10,10,14,0.28), rgba(10,10,14,0.28)), url(${folder.imageUrl})` }
                  : undefined
              }
            />
            <div className="reference-folder-copy">
              <strong>{folder.title}</strong>
              <span>{folder.meta}</span>
            </div>
          </a>
        ))}
      </section>

      <section className="reference-brands-panel">
        <h2>BRANDS WE WORKED WITH</h2>

        <div className="reference-brands-grid">
          {featuredBrands.length ? (
            featuredBrands.map((brand) => {
              const imageUrl =
                brand.logoUrl ||
                brand.coverImageUrl ||
                brand.mediaItems?.[0]?.thumbnailUrl ||
                brand.mediaItems?.[0]?.previewUrl ||
                brand.mediaItems?.[0]?.fileUrl ||
                null;

              return (
                <a
                  key={brand.id}
                  href={`/brand/${brand.slug}`}
                  className="reference-brand-folder"
                >
                  <div className="reference-folder-tab small" />
                  <div
                    className="reference-brand-art"
                    style={
                      imageUrl
                        ? {
                            backgroundImage: `linear-gradient(rgba(20,20,24,0.35), rgba(20,20,24,0.35)), url(${imageUrl})`,
                          }
                        : undefined
                    }
                  />
                  <div className="reference-brand-name">{brand.name}</div>
                </a>
              );
            })
          ) : (
            <div className="empty-state-block">
              <h3>No brands yet</h3>
              <p>Brandurile vor aparea aici dupa publicare.</p>
            </div>
          )}
        </div>
      </section>

      <footer className="reference-home-footer">
        <a href="https://instagram.com/wsod.prod" target="_blank" rel="noreferrer">
          INSTA
        </a>
        <a href="https://youtube.com" target="_blank" rel="noreferrer">
          YOUTUBE
        </a>
        <a href="https://tiktok.com" target="_blank" rel="noreferrer">
          TIKTOK
        </a>
        <a href="tel:+40727205689">+40727205689</a>
        <a href="/servicii-preturi">CONTACT</a>
      </footer>
    </main>
  );
}
