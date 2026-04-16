import Link from "next/link";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { CardCarousel } from "@/components/site/card-carousel";
import { getPublishedBrandBySlug } from "@/lib/dashboard/queries";
import { prisma } from "@/lib/db/prisma";

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

  const allBrands = await prisma.brand.findMany({
    where: { isVisible: true },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      coverImageUrl: true,
      mediaItems: {
        where: { isVisible: true },
        orderBy: [{ isFeatured: "desc" }, { date: "desc" }, { createdAt: "desc" }],
        take: 1,
        select: {
          thumbnailUrl: true,
          previewUrl: true,
          fileUrl: true,
        },
      },
    },
  });

  const currentBrandIndex = allBrands.findIndex((item) => item.slug === brand.slug);
  const prevBrand = currentBrandIndex > 0 ? allBrands[currentBrandIndex - 1] : null;
  const nextBrand =
    currentBrandIndex >= 0 && currentBrandIndex < allBrands.length - 1
      ? allBrands[currentBrandIndex + 1]
      : null;

  const items = brand.mediaItems ?? [];

  const videos = items.filter((item) => item.category === "video");
  const photos = items.filter((item) => item.category === "foto");
  const graphics = items.filter((item) => item.category === "grafica");
  const websites = items.filter((item) => item.category === "website");
  const metaAds = items.filter((item) => item.category === "meta-ads");
  const audio = items.filter((item) => item.category === "audio");
  const rest = items.filter(
    (item) =>
      !["video", "foto", "grafica", "website", "meta-ads", "audio"].includes(item.category)
  );

  const sameBrandCards = items.map((item) => ({
    href: `/${item.category}/${item.slug}`,
    title: item.title,
    subtitle: brand.name,
    imageUrl: item.thumbnailUrl || item.previewUrl || item.fileUrl || brand.coverImageUrl || brand.logoUrl,
  }));

  const otherBrandCards = allBrands
    .filter((item) => item.slug !== brand.slug)
    .map((item) => ({
      href: `/brand/${item.slug}`,
      title: item.name,
      subtitle: "Brand",
      imageUrl:
        item.coverImageUrl ||
        item.logoUrl ||
        item.mediaItems[0]?.thumbnailUrl ||
        item.mediaItems[0]?.previewUrl ||
        item.mediaItems[0]?.fileUrl ||
        null,
    }));

  return (
    <main className="inner-page">
      <section className="inner-section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {prevBrand ? (
              <Link
                href={`/brand/${prevBrand.slug}`}
                style={{
                  border: "1px solid rgba(255,255,255,0.14)",
                  padding: "10px 14px",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                {"<"} {prevBrand.name}
              </Link>
            ) : null}

            {nextBrand ? (
              <Link
                href={`/brand/${nextBrand.slug}`}
                style={{
                  border: "1px solid rgba(255,255,255,0.14)",
                  padding: "10px 14px",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                {nextBrand.name} {">"}
              </Link>
            ) : null}
          </div>

          <Link
            href="/brand"
            style={{
              border: "1px solid rgba(255,255,255,0.14)",
              padding: "10px 14px",
              textDecoration: "none",
              color: "white",
            }}
          >
            Toate brand-urile
          </Link>
        </div>

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

        <CardCarousel title={`Mai multe din ${brand.name}`} items={sameBrandCards} />
        <CardCarousel title="Alte brand-uri" items={otherBrandCards} />
      </section>
    </main>
  );
}
