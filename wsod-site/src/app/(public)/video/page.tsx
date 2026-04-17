import { getBrandsWithCategoryPreviewFromDb } from "@/lib/data/db-queries";
import { getPublishedMediaByCategory } from "@/lib/dashboard/queries";
import { OwnerFolderCard } from "@/components/public/owner-folder-card";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

function hasAiBadge(item: any) {
  return Boolean(item.aiMode || item.aiEdited);
}

function getVideoRatio(item: any) {
  if (item.videoFormat === "wide-16x9") return "wide";
  if (item.videoFormat === "square-1x1") return "square";
  return "portrait";
}

const VIDEO_GROUPS = [
  { title: "Videoclipuri 9:16", videoKind: "normal", videoFormat: "portrait-9x16" },
  { title: "Videoclipuri 16:9", videoKind: "normal", videoFormat: "wide-16x9" },
  { title: "Videoclipuri 1:1", videoKind: "normal", videoFormat: "square-1x1" },
  { title: "Videoclipuri cu versuri 9:16", videoKind: "lyrics", videoFormat: "portrait-9x16" },
  { title: "Videoclipuri cu versuri 16:9", videoKind: "lyrics", videoFormat: "wide-16x9" },
  { title: "Videoclipuri cu versuri 1:1", videoKind: "lyrics", videoFormat: "square-1x1" },
] as const;

export default async function VideoPage() {
  const [items, allBrands] = await Promise.all([
    getPublishedMediaByCategory("video"),
    getBrandsWithCategoryPreviewFromDb("video"),
  ]);

  const brands = allBrands.filter(
    (item) =>
      Array.isArray(item.previewImages) &&
      item.previewImages.length > 0
  );

  const groupedSections = VIDEO_GROUPS.map((group) => {
    const sectionItems = items.filter((item: any) => {
      const normalizedKind = item.videoKind === "lyrics" ? "lyrics" : "normal";
      const normalizedFormat =
        item.videoFormat === "wide-16x9" || item.videoFormat === "square-1x1"
          ? item.videoFormat
          : "portrait-9x16";

      return normalizedKind === group.videoKind && normalizedFormat === group.videoFormat;
    });

    return { ...group, items: sectionItems };
  });
  return (
    <PublicShell title="Video">
      {groupedSections.map((section) =>
        section.items.length > 0 ? (
          <section key={`${section.videoKind}-${section.videoFormat}`} className="inner-section-block">
            <div className="section-mini-head">
              <h2>{section.title}</h2>
            </div>

            <PublicGrid dense>
              {section.items.map((item: any) => (
                <PublicCard
                  key={item.id}
                  title={item.title}
                  href={`/video/${item.slug}`}
                  imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
                  imageOnly
                  showPlayIcon
                  mediaRatio={getVideoRatio(item)}
                  badgeLabel={hasAiBadge(item) ? "AI" : undefined}
                  badgeTooltip={hasAiBadge(item) ? "Video complet generat cu AI." : undefined}
                />
              ))}
            </PublicGrid>
          </section>
        ) : null
      )}
      <section className="inner-section-block">
        <div className="section-mini-head">
          <h2>Branduri</h2>
        </div>

        <div className="public-owner-folder-grid">
          {brands.map((item) => (
            <OwnerFolderCard
              key={item.id}
              title={item.name}
              href={`/brand/${item.slug}`}
              imageUrl={item.previewImages?.[0] || null}
            />
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
