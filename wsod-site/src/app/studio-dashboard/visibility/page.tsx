import { DashboardEmpty } from "@/components/dashboard/dashboard-empty";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardVisibilityPage() {
  return (
    <DashboardShell
      title="Visibility"
      description="Control publicare si vizibilitate."
    >
      <DashboardEmpty
        title="Visibility controls"
        description="Aici vor intra toggle-urile pentru publicat, ascuns, featured si ordonare simpla."
      />
    </DashboardShell>
  );
}
