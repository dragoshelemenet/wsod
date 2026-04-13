import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function StudioDashboardPage() {
  return (
    <DashboardShell
      title="Studio Dashboard"
      description="Panou minimalist pentru administrarea rapida a continutului."
    >
      <DashboardGrid>
        <DashboardCard title="Media" description="Toate fisierele si proiectele" />
        <DashboardCard title="Brands" description="Administrare branduri" />
        <DashboardCard title="Models" description="Administrare modele" />
        <DashboardCard title="Audio" description="Before si after processing" />
        <DashboardCard title="SEO" description="Titluri, descrieri, indexare" />
        <DashboardCard title="Visibility" description="Publicat sau ascuns" />
      </DashboardGrid>
    </DashboardShell>
  );
}
