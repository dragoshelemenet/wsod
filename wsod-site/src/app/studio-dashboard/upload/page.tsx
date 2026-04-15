import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardUploadForm } from "@/components/dashboard/dashboard-upload-form";

export default function DashboardUploadPage() {
  return (
    <DashboardShell
      title="Upload"
      description="Zona de creare rapida pentru media items pe baza URL-urilor existente."
    >
      <DashboardUploadForm />
    </DashboardShell>
  );
}
