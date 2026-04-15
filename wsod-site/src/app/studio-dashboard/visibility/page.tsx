import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardVisibilityManager } from "@/components/dashboard/dashboard-visibility-manager";

export default function DashboardVisibilityPage() {
  return (
    <DashboardShell
      title="Visibility"
      description="Control publicare si vizibilitate pentru sectiuni si entitati."
    >
      <DashboardVisibilityManager />
    </DashboardShell>
  );
}
