import { DashboardEmpty } from "@/components/dashboard/dashboard-empty";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardBrandsPage() {
  return (
    <DashboardShell
      title="Brands"
      description="Administrare branduri publice."
    >
      <DashboardEmpty
        title="Brands list"
        description="Aici va intra lista reala de branduri si ordinea lor in paginare."
      />
    </DashboardShell>
  );
}
