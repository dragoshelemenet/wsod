import { getPublishedMediaByCategory } from "@/lib/dashboard/queries";
import { CategoryHero } from "@/components/public/category-hero";
import { PublicCard } from "@/components/public/public-card";
import { PublicGrid } from "@/components/public/public-grid";
import { PublicShell } from "@/components/public/public-shell";

export default async function WebsitePage() {
  const items = await getPublishedMediaByCategory("website");

  return (
    <PublicShell title="Website" description="Portofoliu public pentru proiecte web.">
      <CategoryHero
        title="Website"
        description="Aici intra proiecte website, inclusiv preview si demo accesare site."
      />
      <PublicGrid>
        {items.map((item) => (
          <PublicCard
            key={item.id}
            title={item.title}
            subtitle="Website"
            href={`/website/${item.slug}`}
            imageUrl={item.coverUrl || item.fileUrl}
          />
        ))}
      </PublicGrid>
    </PublicShell>
  );
}
