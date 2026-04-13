import { DashboardEmpty } from "@/components/dashboard/dashboard-empty";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardSeoPage() {
  return (
    <DashboardShell
      title="SEO"
      description="Administrare metadata SEO, titluri, descrieri si indexare."
    >
      <DashboardEmpty
        title="SEO controls"
        description="Aici vor intra titlurile SEO, descrierile, canonical, noindex si OG image."
      />
    </DashboardShell>
  );
}
