import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardSiteContentForm } from "@/components/dashboard/dashboard-site-content-form";
import { getSiteContentRecord } from "@/lib/dashboard/queries";

export default async function DashboardSiteContentPage() {
  const item = await getSiteContentRecord();

  return (
    <DashboardShell
      title="Site Content"
      description="Administrare texte, linkuri si continut global pentru site."
    >
      <DashboardSiteContentForm item={item} />
    </DashboardShell>
  );
}
