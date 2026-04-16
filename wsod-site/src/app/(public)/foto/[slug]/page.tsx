import { FotoDetailGalleryClient } from "@/components/public/foto-detail-gallery-client";
import { prisma } from "@/lib/prisma";
import { getPublishedMediaBySlug } from "@/lib/dashboard/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function looksAutoTitle(value: string) {
  const v = (value || "").trim().toLowerCase();
  if (!v) return true;
  if (v.length > 40 && /[0-9a-f]{8,}/.test(v)) return true;
  if (v.startsWith("hf") && /[0-9]/.test(v)) return true;
  return false;
}

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

  const sameBrandAllPhotos =
    item.brand?.id
      ? await prisma.mediaItem.findMany({
          where: {
            isVisible: true,
            category: "foto",
            brandId: item.brand.id,
          },
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
          take: 100,
        })
      : [];

  const sameBrandPhotos = sameBrandAllPhotos.filter((photo) => photo.id !== item.id);

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

  const sameModelAllPhotos =
    item.personModel?.id
      ? await prisma.mediaItem.findMany({
          where: {
            isVisible: true,
            category: "foto",
            personModelId: item.personModel.id,
          },
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
          take: 100,
        })
      : [];

  const sameModelPhotos = sameModelAllPhotos.filter((photo) => photo.id !== item.id);

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

  const displayTitle = looksAutoTitle(item.title)
    ? item.brand?.name || item.personModel?.name || "Foto"
    : item.title;

  const mainGalleryItems =
    item.brand?.id
      ? [
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
        ].filter((entry) => entry.src)
      : item.personModel?.id
      ? [
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
        ].filter((entry) => entry.src)
      : [
          {
            id: item.id,
            title: item.title,
            src: item.fileUrl || item.previewUrl || item.thumbnailUrl || "",
            thumb: item.thumbnailUrl || item.previewUrl || item.fileUrl || "",
            rotation: (item as any).rotation ?? 0,
          },
        ].filter((entry) => entry.src);

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>{displayTitle}</h1>
        {item.description ? <p className="inner-description">{item.description}</p> : null}

        <FotoDetailGalleryClient items={mainGalleryItems} />
      </section>

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

      {item.personModel?.name && item.brand?.id && sameModelPhotos.length > 0 ? (
        <section className="inner-section">
          <h2 className="detail-section-title">
            Mai multe poze cu modelul {item.personModel.name}:
          </h2>
          <FotoDetailGalleryClient
            items={sameModelPhotos
              .map((photo) => ({
                id: photo.id,
                title: photo.title,
                src: photo.fileUrl || photo.previewUrl || photo.thumbnailUrl || "",
                thumb: photo.thumbnailUrl || photo.previewUrl || photo.fileUrl || "",
                rotation: (photo as any).rotation ?? 0,
              }))
              .filter((entry) => entry.src)}
          />
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
