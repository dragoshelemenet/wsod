import { DashboardEmpty } from "@/components/dashboard/dashboard-empty";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardModelsPage() {
  return (
    <DashboardShell
      title="Models"
      description="Administrare modele publice."
    >
      <DashboardEmpty
        title="Models list"
        description="Aici va intra lista reala de modele si proiectele asociate."
      />
    </DashboardShell>
  );
}
