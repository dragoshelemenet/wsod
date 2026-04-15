import { DashboardActionCard } from "@/components/dashboard/dashboard-action-card";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { getDashboardOverviewCounts } from "@/lib/dashboard/queries";

export default async function StudioDashboardPage() {
  const counts = await getDashboardOverviewCounts();

  return (
    <DashboardShell
      title="Studio Dashboard"
      description="Panou rapid pentru administrare media, continut, SEO si publicare."
    >
      <div className="dashboard-stats-grid">
        <DashboardStatCard
          label="Media"
          value={String(counts.media)}
          helper="Fisiere totale"
        />
        <DashboardStatCard
          label="Brands"
          value={String(counts.brands)}
          helper="Branduri totale"
        />
        <DashboardStatCard
          label="Models"
          value={String(counts.models)}
          helper="Modele totale"
        />
        <DashboardStatCard
          label="Audio"
          value={String(counts.audio)}
          helper="Proiecte audio"
        />
      </div>

      <DashboardGrid>
        <DashboardActionCard
          href="/studio-dashboard/media"
          title="Media"
          description="Toate fisierele media"
        />
        <DashboardActionCard
          href="/studio-dashboard/brands"
          title="Brands"
          description="Administrare branduri"
        />
        <DashboardActionCard
          href="/studio-dashboard/models"
          title="Models"
          description="Administrare modele"
        />
        <DashboardActionCard
          href="/studio-dashboard/audio"
          title="Audio"
          description="Comparatie inainte / dupa"
        />
        <DashboardActionCard
          href="/studio-dashboard/site-content"
          title="Site Content"
          description="Texte si sectiuni publice"
        />
        <DashboardActionCard
          href="/studio-dashboard/seo"
          title="SEO"
          description="Metadate si indexare"
        />
      </DashboardGrid>
    </DashboardShell>
  );
}
