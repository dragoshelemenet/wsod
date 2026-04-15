import { PublicShell } from "@/components/public/public-shell";
import { CompactCardGrid } from "@/components/public/compact-card-grid";

export function CategoryPageTemplate({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const items = Array.from({ length: 12 }).map((_, index) => ({
    id: `${title}-${index + 1}`,
    title: `${title} Project ${index + 1}`,
    meta: "Grid compact, fara descrieri lungi",
  }));

  return (
    <PublicShell title={title} description={description}>
      <CompactCardGrid items={items} />
    </PublicShell>
  );
}
