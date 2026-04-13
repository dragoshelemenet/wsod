import { BrandsCarousel } from "@/components/public/brands-carousel";
import {
  getPublishedBrands,
  getSiteContentRecord,
} from "@/lib/dashboard/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [brands, siteContent] = await Promise.all([
    getPublishedBrands(),
    getSiteContentRecord(),
  ]);

  const folders = [
    {
      title: "PHOTO",
      href: "/foto",
      meta: "",
    },
    {
      title: "VIDEO",
      href: "/video",
      meta: "",
    },
    {
      title: "AUDIO",
      href: "/audio",
      meta: "",
    },
    {
      title: "GRAPHICA",
      href: "/grafica",
      meta: "FLYERE · COVERURI · CARTI VIZITA",
    },
    {
      title: "WEBSITE-URI",
      href: "/website",
      meta: "",
    },
    {
      title: "META ADS",
      href: "/meta-ads",
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
          {siteContent?.homeLogoUrl ? (
            <img
              src={siteContent.homeLogoUrl}
              alt="WSOD"
              className="reference-logo-image"
            />
          ) : (
            <>
              <div className="reference-logo-3d">WSOD</div>
              <div className="reference-logo-prod">PROD</div>
            </>
          )}
        </div>

        <div className="reference-title-column">
          <h1>AGENTIE MEDIA DIGITALA &amp; VIDEO</h1>
        </div>
      </section>

      <section className="reference-folders-v2">
        {folders.map((folder) => (
          <a key={folder.href} href={folder.href} className="reference-folder-v2">
            <div className="reference-folder-v2-tab" />
            <div className="reference-folder-v2-art">
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
