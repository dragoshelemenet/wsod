import { DashboardEmpty } from "@/components/dashboard/dashboard-empty";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardSiteContentPage() {
  return (
    <DashboardShell
      title="Site Content"
      description="Administrare texte, sectiuni si continut static."
    >
      <DashboardEmpty
        title="Site content editor"
        description="Aici vor intra textele globale, continutul homepage, servicii si alte zone editabile."
      />
    </DashboardShell>
  );
}
