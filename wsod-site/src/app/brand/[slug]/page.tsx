import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { CardCarousel } from "@/components/site/card-carousel";

type BrandPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BrandPage({ params }: BrandPageProps) {
  const { slug } = await params;

  const brands = await prisma.brand.findMany({
    where: { isVisible: true },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      logoUrl: true,
      coverImageUrl: true,
      mediaItems: {
        where: { isVisible: true },
        orderBy: [{ isFeatured: "desc" }, { date: "desc" }, { createdAt: "desc" }],
        take: 24,
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          thumbnailUrl: true,
          previewUrl: true,
          fileUrl: true,
        },
      },
    },
  });

  const currentIndex = brands.findIndex((item) => item.slug === slug);
  if (currentIndex === -1) notFound();

  const brand = brands[currentIndex];
  const prevBrand = currentIndex > 0 ? brands[currentIndex - 1] : null;
  const nextBrand = currentIndex < brands.length - 1 ? brands[currentIndex + 1] : null;

  const brandMediaCards = brand.mediaItems.map((item) => ({
    href: `/${item.category}/${item.slug}`,
    title: item.title,
    subtitle: brand.name,
    imageUrl: item.thumbnailUrl || item.previewUrl || item.fileUrl || brand.coverImageUrl || brand.logoUrl,
  }));

  const otherBrandCards = brands
    .filter((item) => item.slug !== brand.slug)
    .map((item) => ({
      href: `/brand/${item.slug}`,
      title: item.name,
      subtitle: `${item.mediaItems.length} items`,
      imageUrl:
        item.coverImageUrl ||
        item.logoUrl ||
        item.mediaItems[0]?.thumbnailUrl ||
        item.mediaItems[0]?.previewUrl ||
        item.mediaItems[0]?.fileUrl ||
        null,
    }));

  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 20px 80px" }}>
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

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1.1fr) minmax(300px,0.9fr)",
          gap: 24,
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            minHeight: 360,
            background: "#111",
            overflow: "hidden",
          }}
        >
          {brand.coverImageUrl || brand.logoUrl || brand.mediaItems[0]?.thumbnailUrl ? (
            <img
              src={
                brand.coverImageUrl ||
                brand.logoUrl ||
                brand.mediaItems[0]?.thumbnailUrl ||
                brand.mediaItems[0]?.previewUrl ||
                brand.mediaItems[0]?.fileUrl ||
                ""
              }
              alt={brand.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : null}
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.03)",
            padding: 24,
          }}
        >
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>Brand</div>
          <h1 style={{ fontSize: 40, lineHeight: 1, margin: "0 0 16px" }}>{brand.name}</h1>
          <p style={{ opacity: 0.82, lineHeight: 1.6 }}>
            {brand.description || "Portofoliu brand + lucrari asociate acestui brand."}
          </p>

          <div style={{ marginTop: 20, opacity: 0.72 }}>
            {brand.mediaItems.length} lucrări vizibile
          </div>
        </div>
      </section>

      <CardCarousel title={`Mai multe din ${brand.name}`} items={brandMediaCards} />
      <CardCarousel title="Alte brand-uri" items={otherBrandCards} />
    </main>
  );
}
