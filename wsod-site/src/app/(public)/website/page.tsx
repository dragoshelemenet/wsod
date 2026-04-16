import Link from "next/link";
import { getBrandsWithCategoryPreviewFromDb } from "@/lib/data/db-queries";
import { getPublishedMediaByCategory } from "@/lib/dashboard/queries";
import { OwnerFolderCard } from "@/components/public/owner-folder-card";
import { PublicShell } from "@/components/public/public-shell";

const WEBSITE_ICON =
  "https://img.icons8.com/ios-filled/100/domain.png";

export default async function WebsitePage() {
  const [items, allBrands] = await Promise.all([
    getPublishedMediaByCategory("website"),
    getBrandsWithCategoryPreviewFromDb("website"),
  ]);

  const brands = allBrands.filter(
    (item) =>
      Array.isArray(item.previewImages) &&
      item.previewImages.length > 0
  );

  return (
    <PublicShell title="Website" description="Website-uri create de WSOD.PROD">
      <div className="website-card-grid">
        {items.map((item) => {
          const imageUrl = item.thumbnailUrl || item.previewUrl || item.fileUrl || "";
          return (
            <Link
              key={item.id}
              href={`/website/${item.slug}`}
              className="website-card-link"
            >
              <div className="website-card-media">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={item.title}
                    className="website-card-image"
                  />
                ) : null}

                <div className="website-card-badge">
                  <img
                    src={WEBSITE_ICON}
                    alt="Website"
                    className="website-card-badge-icon"
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

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
