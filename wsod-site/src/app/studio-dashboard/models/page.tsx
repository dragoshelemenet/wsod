import { DashboardModelForm } from "@/components/dashboard/dashboard-model-form";
import { DashboardModelList } from "@/components/dashboard/dashboard-model-list";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardModels } from "@/lib/dashboard/queries";

export default async function DashboardModelsPage() {
  const items = await getDashboardModels();

  return (
    <DashboardShell
      title="Models"
      description="Administrare modele publice."
    >
      <DashboardModelForm />
      <DashboardModelList items={items} />
    </DashboardShell>
  );
}
