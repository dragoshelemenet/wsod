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

function getDisplayTitle(item: any) {
  return looksAutoTitle(item.title)
    ? item.brand?.name || item.personModel?.name || "Foto"
    : item.title;
}

function AiBadge({ mode }: { mode?: string | null }) {
  const isFullAi = mode === "ai";
  const title = isFullAi
    ? "Fotosesiune complet creată cu AI."
    : "Hainele sau unele elemente au fost schimbate cu AI.";
  const label = isFullAi ? "AI" : "AI EDIT";

  return (
    <div
      className="ai-photo-badge"
      data-ai-tooltip={title}
    >
      <span className="ai-photo-badge-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="ai-photo-badge-icon-svg">
          <path
            d="M12 3l1.9 4.6L18.5 9l-4.6 1.4L12 15l-1.9-4.6L5.5 9l4.6-1.4L12 3z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="ai-photo-badge-text">{label}</span>
    </div>
  );
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

  const displayTitle = getDisplayTitle(item);

  const mainGalleryItems =
    item.brand?.id
      ? sameBrandAllPhotos
          .map((photo) => ({
            id: photo.id,
            title: photo.title,
            displayTitle: looksAutoTitle(photo.title) ? item.brand?.name || "Foto" : photo.title,
            slug: photo.slug,
            src: photo.fileUrl || photo.previewUrl || photo.thumbnailUrl || "",
            thumb: photo.thumbnailUrl || photo.previewUrl || photo.fileUrl || "",
            aiMode: (photo as any).aiMode || (Boolean((photo as any).aiEdited) ? "ai-edit" : ""),
          }))
          .filter((entry) => entry.src)
      : item.personModel?.id
      ? sameModelAllPhotos
          .map((photo) => ({
            id: photo.id,
            title: photo.title,
            displayTitle: looksAutoTitle(photo.title)
              ? item.personModel?.name || "Foto"
              : photo.title,
            slug: photo.slug,
            src: photo.fileUrl || photo.previewUrl || photo.thumbnailUrl || "",
            thumb: photo.thumbnailUrl || photo.previewUrl || photo.fileUrl || "",
            aiMode: (photo as any).aiMode || (Boolean((photo as any).aiEdited) ? "ai-edit" : ""),
          }))
          .filter((entry) => entry.src)
      : [
          {
            id: item.id,
            title: item.title,
            displayTitle: getDisplayTitle(item),
            slug: item.slug,
            src: item.fileUrl || item.previewUrl || item.thumbnailUrl || "",
            thumb: item.thumbnailUrl || item.previewUrl || item.fileUrl || "",
            aiMode: (item as any).aiMode || (Boolean((item as any).aiEdited) ? "ai-edit" : ""),
          },
        ].filter((entry) => entry.src);

  return (
    <main className="inner-page">
      <section className="inner-section">
        <h1 id="detail-dynamic-title">{displayTitle}</h1>
        {item.description ? <p className="inner-description">{item.description}</p> : null}

        <FotoDetailGalleryClient items={mainGalleryItems} titleTargetId="detail-dynamic-title" />
      </section>

      {otherBrandPhotos.length ? (
        <section className="inner-section">
          <h2 className="detail-section-title">Alte poze din alte brand-uri:</h2>

          <div className="detail-thumb-grid-foto-related">
            {otherBrandPhotos.map((photo) => (
              <a
                key={photo.id}
                href={`/foto/${photo.slug}`}
                className="detail-thumb-link-foto-related detail-thumb-link-dimmed"
              >
                <img
                  src={photo.thumbnailUrl || photo.previewUrl || photo.fileUrl || undefined}
                  alt={photo.title}
                  className="detail-thumb-image"
                />
                {((photo as any).aiMode || (Boolean((photo as any).aiEdited) ? "ai-edit" : "")) ? <AiBadge mode={(photo as any).aiMode || (Boolean((photo as any).aiEdited) ? "ai-edit" : "")} /> : null}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {item.personModel?.name && item.brand?.id && sameModelAllPhotos.length > 1 ? (
        <section className="inner-section">
          <h2 className="detail-section-title">
            Mai multe poze cu modelul {item.personModel.name}:
          </h2>
          <FotoDetailGalleryClient
            items={sameModelAllPhotos
              .map((photo) => ({
                id: photo.id,
                title: photo.title,
                displayTitle: looksAutoTitle(photo.title)
                  ? item.personModel?.name || "Foto"
                  : photo.title,
                slug: photo.slug,
                src: photo.fileUrl || photo.previewUrl || photo.thumbnailUrl || "",
                thumb: photo.thumbnailUrl || photo.previewUrl || photo.fileUrl || "",
                aiMode: (photo as any).aiMode || (Boolean((photo as any).aiEdited) ? "ai-edit" : ""),
              }))
              .filter((entry) => entry.src)}
          />
        </section>
      ) : null}

      {otherModelPhotos.length ? (
        <section className="inner-section">
          <h2 className="detail-section-title">Alte poze cu alte modele:</h2>

          <div className="detail-thumb-grid-foto-related">
            {otherModelPhotos.map((photo) => (
              <a
                key={photo.id}
                href={`/foto/${photo.slug}`}
                className="detail-thumb-link-foto-related"
              >
                <img
                  src={photo.thumbnailUrl || photo.previewUrl || photo.fileUrl || undefined}
                  alt={photo.title}
                  className="detail-thumb-image"
                />
                {((photo as any).aiMode || (Boolean((photo as any).aiEdited) ? "ai-edit" : "")) ? <AiBadge mode={(photo as any).aiMode || (Boolean((photo as any).aiEdited) ? "ai-edit" : "")} /> : null}
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
