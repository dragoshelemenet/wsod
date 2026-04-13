import { DashboardSeoForm } from "@/components/dashboard/dashboard-seo-form";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getSiteContentRecord } from "@/lib/dashboard/queries";

export default async function DashboardSeoPage() {
  const item = await getSiteContentRecord();

  return (
    <DashboardShell
      title="SEO"
      description="Administrare etichete globale, texte si valori folosite pentru SEO/content."
    >
      <DashboardSeoForm item={item} />
    </DashboardShell>
  );
}
