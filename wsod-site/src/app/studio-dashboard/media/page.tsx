import { DashboardEmpty } from "@/components/dashboard/dashboard-empty";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardMediaPage() {
  return (
    <DashboardShell
      title="Media"
      description="Administrare media pentru toate categoriile publice."
    >
      <DashboardEmpty
        title="Media list"
        description="Aici va intra lista reala de fisiere media, filtre si actiuni."
      />
    </DashboardShell>
  );
}
