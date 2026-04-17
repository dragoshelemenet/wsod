import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardTalentForm } from "@/components/dashboard/dashboard-talent-form";
import { DashboardTalentList } from "@/components/dashboard/dashboard-talent-list";
import { getDashboardTalents } from "@/lib/dashboard/queries";

export default async function DashboardInfluencersPage() {
  const items = await getDashboardTalents();
  const influencers = items.filter((item) => item.kind === "influencer");

  return (
    <DashboardShell
      title="Influencers"
      description="Administrare influenceri publici."
    >
      <DashboardTalentForm kind="influencer" />
      <DashboardTalentList kind="influencer" items={influencers} />
    </DashboardShell>
  );
}
