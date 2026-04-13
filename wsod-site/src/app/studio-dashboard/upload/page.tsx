import { DashboardEmpty } from "@/components/dashboard/dashboard-empty";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardUploadPage() {
  return (
    <DashboardShell
      title="Upload"
      description="Zona de upload pentru fisiere noi si organizare rapida."
    >
      <DashboardEmpty
        title="Upload zone"
        description="Aici va intra upload-ul real pentru imagini, video, audio, cover-uri si fisiere auxiliare."
      />
    </DashboardShell>
  );
}
