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

  const randomPhotos = await prisma.mediaItem.findMany({
    where: {
      isVisible: true,
      category: "foto",
      id: { not: item.id },
      personModelId: { not: null },
      ...(item.personModel?.id
        ? { NOT: { personModelId: item.personModel.id } }
        : {}),
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    take: 18,
  });

  const galleryItems = [
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

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1>{item.title}</h1>
        {item.description ? <p className="inner-description">{item.description}</p> : null}

        <FotoDetailGalleryClient items={galleryItems} />
      </section>

      {randomPhotos.length ? (
        <section className="inner-section">
          <h2 className="detail-section-title">Vezi alte poze:</h2>

          <div className="detail-thumb-grid">
            {randomPhotos.map((photo) => (
              <a
                key={photo.id}
                href={`/foto/${photo.slug}`}
                className="detail-thumb-link"
              >
                <img
                  src={photo.thumbnailUrl || photo.previewUrl || photo.fileUrl || undefined}
                  alt={photo.title}
                  className="detail-thumb-image"
                  style={{ transform: `rotate(${((photo as any).rotation ?? 0)}deg)` }}
                />
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
