import { getBrandsWithCategoryPreviewFromDb } from "@/lib/data/db-queries";
import { getPublishedMediaByCategory } from "@/lib/dashboard/queries";
import { OwnerFolderCard } from "@/components/public/owner-folder-card";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

function hasAiBadge(item: any) {
  return Boolean(item.aiMode || item.aiEdited);
}

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

  const normalVideos = items.filter((item: any) => item.videoKind !== "lyrics");
  const lyricVideos = items.filter((item: any) => item.videoKind === "lyrics");

  return (
    <PublicShell title="Video">
      {normalVideos.length > 0 ? (
        <section className="inner-section-block">
          <div className="section-mini-head">
            <h2>Videoclipuri</h2>
          </div>

          <PublicGrid dense>
            {normalVideos.map((item: any) => (
              <PublicCard
                key={item.id}
                title={item.title}
                href={`/video/${item.slug}`}
                imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
                imageOnly
                showPlayIcon
                badgeLabel={hasAiBadge(item) ? "AI" : undefined}
                badgeTooltip={hasAiBadge(item) ? "Video complet generat cu AI." : undefined}
              />
            ))}
          </PublicGrid>
        </section>
      ) : null}

      {lyricVideos.length > 0 ? (
        <section className="inner-section-block">
          <div className="section-mini-head">
            <h2>Videoclipuri cu versuri</h2>
          </div>

          <PublicGrid dense>
            {lyricVideos.map((item: any) => (
              <PublicCard
                key={item.id}
                title={item.title}
                href={`/video/${item.slug}`}
                imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
                imageOnly
                showPlayIcon
                mediaRatio="wide"
                badgeLabel={hasAiBadge(item) ? "AI" : undefined}
                badgeTooltip={hasAiBadge(item) ? "Video complet generat cu AI." : undefined}
              />
            ))}
          </PublicGrid>
        </section>
      ) : null}

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
