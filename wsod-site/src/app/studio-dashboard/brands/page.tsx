import { DashboardBrandForm } from "@/components/dashboard/dashboard-brand-form";
import { DashboardBrandList } from "@/components/dashboard/dashboard-brand-list";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardBrands } from "@/lib/dashboard/queries";

export default async function DashboardBrandsPage() {
  const items = await getDashboardBrands();

  return (
    <DashboardShell
      title="Brands"
      description="Administrare branduri publice."
    >
      <DashboardBrandForm />
      <DashboardBrandList items={items} />
    </DashboardShell>
  );
}
