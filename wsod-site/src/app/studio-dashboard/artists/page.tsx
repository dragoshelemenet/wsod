import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardTalentForm } from "@/components/dashboard/dashboard-talent-form";
import { DashboardTalentList } from "@/components/dashboard/dashboard-talent-list";
import { getDashboardTalents } from "@/lib/dashboard/queries";

export default async function DashboardArtistsPage() {
  const items = await getDashboardTalents();
  const artists = items.filter((item) => item.kind === "artist");

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
