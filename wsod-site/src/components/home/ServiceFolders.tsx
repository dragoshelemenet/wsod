import Link from "next/link";
import { homeCategories } from "@/lib/data/home-data";
import {
  getMediaByCategoryFromDb,
  getVisibleSiteSectionsFromDb,
} from "@/lib/data/db-queries";

function isImageUrl(url?: string | null) {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"].some((ext) =>
    clean.endsWith(ext)
  );
}

function isVideoUrl(url?: string | null) {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return [".mp4", ".webm", ".mov", ".m4v", ".ogg"].some((ext) =>
    clean.endsWith(ext)
  );
}

function getBestImageSrc(item: {
  thumbnailUrl?: string | null;
  previewUrl?: string | null;
  fileUrl?: string | null;
}) {
  return [item.thumbnailUrl, item.previewUrl, item.fileUrl].find((url) =>
    isImageUrl(url)
  ) || null;
}

function getBestVideoSrc(item: {
  thumbnailUrl?: string | null;
  previewUrl?: string | null;
  fileUrl?: string | null;
}) {
  return [item.fileUrl, item.previewUrl, item.thumbnailUrl].find((url) =>
    isVideoUrl(url)
  ) || null;
}

export default async function ServiceFolders() {
  const visibleSections = await getVisibleSiteSectionsFromDb();
  const visibleKeys = new Set(
    visibleSections.filter((section) => section.isVisible).map((section) => section.key)
  );

  const visibleCategories = homeCategories.filter((service) =>
    visibleKeys.has(service.slug)
  );

  const folderData = await Promise.all(
    visibleCategories.map(async (service) => {
      const items = await getMediaByCategoryFromDb(service.slug, { limit: 3 });

      return {
        service,
        previews: items
          .map((item) => ({
            imageSrc: getBestImageSrc(item),
            videoSrc: getBestVideoSrc(item),
          }))
          .filter((shot) => shot.imageSrc || shot.videoSrc)
          .slice(0, 3),
      };
    })
  );

  return (
    <section className="section">
      <div className="folder-grid">
        {folderData.map(({ service, previews }) => (
          <Link
            key={service.slug}
            href={`/${service.slug}`}
            className="folder-card folder-card-rich"
          >
            <div className="folder-top" />

            <div className="folder-body">
              <span>{service.title}</span>
            </div>

            {previews.length ? (
              <div className="folder-hover-preview" aria-hidden="true">
                {previews.map((shot, index) => (
                  <div
                    key={`${service.slug}-${index}-${shot.imageSrc || shot.videoSrc}`}
                    className={`folder-hover-shot folder-hover-shot-${index + 1}`}
                  >
                    {shot.videoSrc ? (
                      <video
                        src={shot.videoSrc}
                        muted
                        playsInline
                        autoPlay
                        loop
                        preload="metadata"
                        poster={shot.imageSrc || undefined}
                      />
                    ) : shot.imageSrc ? (
                      <img src={shot.imageSrc} alt="" loading="lazy" />
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}