import { getBrandsWithCategoryPreviewFromDb } from "@/lib/data/db-queries";
import { getPublishedMediaByCategory } from "@/lib/dashboard/queries";
import { OwnerFolderCard } from "@/components/public/owner-folder-card";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

const GRAPHIC_SECTIONS = [
  { key: "flyer", label: "Flyere" },
  { key: "carte-vizita", label: "Cărți de vizită" },
  { key: "certificat", label: "Certificate" },
  { key: "poster", label: "Postere" },
  { key: "banner", label: "Bannere" },
  { key: "meniu", label: "Meniuri" },
  { key: "ambalaj", label: "Ambalaje" },
  { key: "eticheta", label: "Etichete" },
  { key: "social-media", label: "Grafică social media" },
  { key: "logo", label: "Logo-uri" },
  { key: "altul", label: "Altele" },
] as const;

export default async function GraficaPage() {
  const [items, allBrands] = await Promise.all([
    getPublishedMediaByCategory("grafica"),
    getBrandsWithCategoryPreviewFromDb("grafica"),
  ]);

  const brands = allBrands.filter(
    (item) =>
      Array.isArray(item.previewImages) &&
      item.previewImages.length > 0
  );

  const itemsByKind = new Map<string, any[]>();

  for (const section of GRAPHIC_SECTIONS) {
    itemsByKind.set(section.key, []);
  }

  const uncategorizedItems: any[] = [];

  for (const item of items as any[]) {
    const key = item.graphicKind || "";
    if (key && itemsByKind.has(key)) {
      itemsByKind.get(key)!.push(item);
    } else {
      uncategorizedItems.push(item);
    }
  }

  return (
    <PublicShell title="Grafica" description="Portofoliu public pentru proiecte grafice.">
      {GRAPHIC_SECTIONS.map((section) => {
        const sectionItems = itemsByKind.get(section.key) || [];
        if (!sectionItems.length) return null;

        return (
          <section key={section.key} className="inner-section-block">
            <div className="section-mini-head">
              <h2>{section.label}</h2>
            </div>

            <PublicGrid dense>
              {sectionItems.map((item) => (
                <PublicCard
                  key={item.id}
                  title={item.title}
                  href={`/grafica/${item.slug}`}
                  imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
                  imageOnly
                  imageFit="contain"
                  mediaRatio="wide"
                />
              ))}
            </PublicGrid>
          </section>
        );
      })}

      {uncategorizedItems.length > 0 ? (
        <section className="inner-section-block">
          <div className="section-mini-head">
            <h2>Alte grafici</h2>
          </div>

          <PublicGrid dense>
            {uncategorizedItems.map((item) => (
              <PublicCard
                key={item.id}
                title={item.title}
                href={`/grafica/${item.slug}`}
                imageUrl={item.thumbnailUrl || item.previewUrl || item.fileUrl}
                imageOnly
                imageFit="contain"
                mediaRatio="wide"
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
              
                imageUrl={item.logoUrl || null}
                variant="brand"
            />
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
