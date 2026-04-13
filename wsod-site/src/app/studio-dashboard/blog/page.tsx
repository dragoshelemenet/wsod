import { DashboardEmpty } from "@/components/dashboard/dashboard-empty";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardBlogPage() {
  return (
    <DashboardShell
      title="Blog"
      description="Administrare articole blog."
    >
      <DashboardEmpty
        title="Blog manager"
        description="Aici vor intra lista articolelor, editorul de continut si publicarea lor."
      />
    </DashboardShell>
  );
}
