import Link from "next/link";
import { FotoDetailGalleryClient } from "@/components/public/foto-detail-gallery-client";
import { prisma } from "@/lib/prisma";
import { getPublishedMediaBySlug } from "@/lib/dashboard/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function FotoSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getPublishedMediaBySlug(slug);

  if (!item) {
    return (
      <main className="inner-page">
        <section className="inner-section">
          <h1>Foto not found</h1>
          <p className="inner-description">Proiectul foto nu a fost gasit.</p>
        </section>
      </main>
    );
  }

  const sameBrandPhotos =
    item.brand?.id
      ? await prisma.mediaItem.findMany({
          where: {
            isVisible: true,
            category: "foto",
            brandId: item.brand.id,
            id: { not: item.id },
          },
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
          take: 24,
        })
      : [];

  const otherBrandPhotos =
    item.brand?.id
      ? await prisma.mediaItem.findMany({
          where: {
            isVisible: true,
            category: "foto",
            id: { not: item.id },
            brandId: { not: null },
            NOT: { brandId: item.brand.id },
          },
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
          take: 18,
        })
      : [];

  const sameModelPhotos =
    item.personModel?.id
      ? await prisma.mediaItem.findMany({
          where: {
            isVisible: true,
            category: "foto",
            personModelId: item.personModel.id,
            id: { not: item.id },
          },
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
          take: 24,
        })
      : [];

  const otherModelPhotos =
    item.personModel?.id
      ? await prisma.mediaItem.findMany({
          where: {
            isVisible: true,
            category: "foto",
            id: { not: item.id },
            personModelId: { not: null },
            NOT: { personModelId: item.personModel.id },
          },
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
          take: 18,
        })
      : [];

  const fallbackPhotos = await prisma.mediaItem.findMany({
    where: {
      isVisible: true,
      category: "foto",
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    take: 200,
  });

  const navigationSource =
    item.brand?.id
      ? [
          item,
          ...sameBrandPhotos,
        ]
      : item.personModel?.id
      ? [
          item,
          ...sameModelPhotos,
        ]
      : fallbackPhotos;

  const navigationItems = navigationSource
    .filter((photo) => (photo.fileUrl || photo.previewUrl || photo.thumbnailUrl) && photo.slug)
    .filter((photo, index, arr) => arr.findIndex((x) => x.id === photo.id) === index);

  const currentIndex = navigationItems.findIndex((photo) => photo.id === item.id);
  const prevPhoto =
    currentIndex > 0 ? navigationItems[currentIndex - 1] : null;
  const nextPhoto =
    currentIndex >= 0 && currentIndex < navigationItems.length - 1
      ? navigationItems[currentIndex + 1]
      : null;

  const brandGalleryItems = [
    {
      id: item.id,
      title: item.title,
      src: item.fileUrl || item.previewUrl || item.thumbnailUrl || "",
      thumb: item.thumbnailUrl || item.previewUrl || item.fileUrl || "",
      rotation: (item as any).rotation ?? 0,
    },
    ...sameBrandPhotos.map((photo) => ({
      id: photo.id,
      title: photo.title,
      src: photo.fileUrl || photo.previewUrl || photo.thumbnailUrl || "",
      thumb: photo.thumbnailUrl || photo.previewUrl || photo.fileUrl || "",
      rotation: (photo as any).rotation ?? 0,
    })),
  ].filter((entry) => entry.src);

  const modelGalleryItems = [
    {
      id: item.id,
      title: item.title,
      src: item.fileUrl || item.previewUrl || item.thumbnailUrl || "",
      thumb: item.thumbnailUrl || item.previewUrl || item.fileUrl || "",
      rotation: (item as any).rotation ?? 0,
    },
    ...sameModelPhotos.map((photo) => ({
      id: photo.id,
      title: photo.title,
      src: photo.fileUrl || photo.previewUrl || photo.thumbnailUrl || "",
      thumb: photo.thumbnailUrl || photo.previewUrl || photo.fileUrl || "",
      rotation: (photo as any).rotation ?? 0,
    })),
  ].filter((entry) => entry.src);

  const navigationLabel = item.brand?.name
    ? `Navighezi prin brandul ${item.brand.name}`
    : item.personModel?.name
    ? `Navighezi prin modelul ${item.personModel.name}`
    : "Navighezi prin toate pozele";

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
            {prevPhoto ? (
              <Link
                href={`/foto/${prevPhoto.slug}`}
                style={{
                  border: "1px solid rgba(255,255,255,0.14)",
                  padding: "10px 14px",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                {"<"} Prev
              </Link>
            ) : null}

            {nextPhoto ? (
              <Link
                href={`/foto/${nextPhoto.slug}`}
                style={{
                  border: "1px solid rgba(255,255,255,0.14)",
                  padding: "10px 14px",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                Next {">"}
              </Link>
            ) : null}
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.14)",
              padding: "10px 14px",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            {navigationLabel}
          </div>
        </div>

        <h1>{item.title}</h1>
        {item.description ? <p className="inner-description">{item.description}</p> : null}

        <FotoDetailGalleryClient
          items={[
            {
              id: item.id,
              title: item.title,
              src: item.fileUrl || item.previewUrl || item.thumbnailUrl || "",
              thumb: item.thumbnailUrl || item.previewUrl || item.fileUrl || "",
              rotation: (item as any).rotation ?? 0,
            },
          ].filter((entry) => entry.src)}
        />
      </section>

      {item.brand?.name && brandGalleryItems.length > 1 ? (
        <section className="inner-section">
          <h2 className="detail-section-title">Mai multe poze din brandul {item.brand.name}:</h2>
          <FotoDetailGalleryClient items={brandGalleryItems} />
        </section>
      ) : null}

      {otherBrandPhotos.length ? (
        <section className="inner-section">
          <h2 className="detail-section-title">Alte poze din alte brand-uri:</h2>

          <div className="detail-thumb-grid">
            {otherBrandPhotos.map((photo) => (
              <a
                key={photo.id}
                href={`/foto/${photo.slug}`}
                className="detail-thumb-link"
              >
                <img
                  src={photo.thumbnailUrl || photo.previewUrl || photo.fileUrl || undefined}
                  alt={photo.title}
                  className="detail-thumb-image"
                />
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {item.personModel?.name && modelGalleryItems.length > 1 ? (
        <section className="inner-section">
          <h2 className="detail-section-title">Mai multe poze cu modelul {item.personModel.name}:</h2>
          <FotoDetailGalleryClient items={modelGalleryItems} />
        </section>
      ) : null}

      {otherModelPhotos.length ? (
        <section className="inner-section">
          <h2 className="detail-section-title">Alte poze cu alte modele:</h2>

          <div className="detail-thumb-grid">
            {otherModelPhotos.map((photo) => (
              <a
                key={photo.id}
                href={`/foto/${photo.slug}`}
                className="detail-thumb-link"
              >
                <img
                  src={photo.thumbnailUrl || photo.previewUrl || photo.fileUrl || undefined}
                  alt={photo.title}
                  className="detail-thumb-image"
                />
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
