import { DashboardEmpty } from "@/components/dashboard/dashboard-empty";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardAudioPage() {
  return (
    <DashboardShell
      title="Audio"
      description="Administrare proiecte audio si comparatie before / after."
    >
      <DashboardEmpty
        title="Audio projects"
        description="Aici va intra upload-ul de before si after, plus player-ele pentru comparatie."
      />
    </DashboardShell>
  );
}
