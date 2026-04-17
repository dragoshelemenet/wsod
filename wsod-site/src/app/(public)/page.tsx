import { BrandsCarousel } from "@/components/public/brands-carousel";
import { getHomepageCollections, getPublishedBrands } from "@/lib/dashboard/queries";

export default async function HomePage() {
  const data = await getHomepageCollections();
  const brands = await getPublishedBrands();

  const folders = [
    {
      title: "FOTO",
      href: "/foto",
      imageUrl:
        data.foto[0]?.thumbnailUrl ||
        data.foto[0]?.previewUrl ||
        data.foto[0]?.fileUrl ||
        null,
      meta: "",
    },
    {
      title: "VIDEO",
      href: "/video",
      imageUrl:
        data.video[0]?.thumbnailUrl ||
        data.video[0]?.previewUrl ||
        data.video[0]?.fileUrl ||
        null,
      meta: "",
    },
    {
      title: "AUDIO",
      href: "/audio",
      imageUrl:
        data.audio[0]?.thumbnailUrl ||
        data.audio[0]?.previewUrl ||
        data.audio[0]?.fileUrl ||
        null,
      meta: "",
    },
    {
      title: "GRAFICA",
      href: "/grafica",
      imageUrl:
        data.grafica[0]?.thumbnailUrl ||
        data.grafica[0]?.previewUrl ||
        data.grafica[0]?.fileUrl ||
        null,
      meta: "FLYERE · COVERURI · CARTI VIZITA",
    },
    {
      title: "WEBSITE-URI",
      href: "/website",
      imageUrl:
        data.website[0]?.thumbnailUrl ||
        data.website[0]?.previewUrl ||
        data.website[0]?.fileUrl ||
        null,
      meta: "",
    },
    {
      title: "META ADS",
      href: "/meta-ads",
      imageUrl:
        data.metaAds[0]?.thumbnailUrl ||
        data.metaAds[0]?.previewUrl ||
        data.metaAds[0]?.fileUrl ||
        null,
      meta: "LEAD-URI",
    },
  ];

  const featuredBrands = brands.map((brand) => ({
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    imageUrl:
      brand.logoUrl ||
      brand.coverImageUrl ||
      brand.mediaItems?.[0]?.thumbnailUrl ||
      brand.mediaItems?.[0]?.previewUrl ||
      brand.mediaItems?.[0]?.fileUrl ||
      null,
  }));

  return (
    <main className="reference-home-v2">
      <section className="reference-topbar">
        <a href="/servicii-preturi">Servicii & preturi</a>
        <a href="/servicii-preturi">Contact</a>
        <a href="/servicii-preturi">Primul video/foto gratis</a>
      </section>

      <section className="reference-hero-v2">
        <div className="reference-logo-column">
          <div className="reference-logo-3d">WSOD</div>
          <div className="reference-logo-prod">PROD</div>
        </div>

        <div className="reference-title-column">
          <h1>AGENTIE MEDIA DIGITALA &amp; VIDEO</h1>
        </div>
      </section>

      <section className="reference-folders-v2">
        {folders.map((folder) => (
          <a key={folder.href} href={folder.href} className="reference-folder-v2">
            <div className="reference-folder-v2-tab" />
            <div
              className="reference-folder-v2-art"
              style={
                folder.imageUrl
                  ? {
                      backgroundImage: `linear-gradient(rgba(14,14,18,0.22), rgba(14,14,18,0.22)), url(${folder.imageUrl})`,
                    }
                  : undefined
              }
            >
              <div className="reference-folder-overlay-copy">
                <strong>{folder.title}</strong>
                {folder.meta ? <span>{folder.meta}</span> : null}
              </div>
            </div>
          </a>
        ))}
      </section>

      <section className="reference-brands-v2">
        <BrandsCarousel items={featuredBrands} />
      </section>

      <footer className="reference-footer-v2">
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
