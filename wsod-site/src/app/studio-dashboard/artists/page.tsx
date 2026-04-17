import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardTalentForm } from "@/components/dashboard/dashboard-talent-form";
import { DashboardTalentList } from "@/components/dashboard/dashboard-talent-list";
import { getDashboardTalents } from "@/lib/dashboard/queries";

export default async function DashboardArtistsPage() {
  const items = await getDashboardTalents();

  const artists = items
    .filter((item) => item.kind === "artist")
    .map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      kind: "artist" as const,
      portraitImageUrl: item.portraitImageUrl,
      coverImageUrl: item.coverImageUrl,
      description: item.description,
      isVisible: item.isVisible,
    }));

  return (
    <DashboardShell
      title="Artists"
      description="Administrare artiști publici."
    >
      <DashboardTalentForm kind="artist" />
      <DashboardTalentList kind="artist" items={artists} />
    </DashboardShell>
  );
}
