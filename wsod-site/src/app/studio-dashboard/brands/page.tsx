import { DashboardBrandForm } from "@/components/dashboard/dashboard-brand-form";
import { DashboardBrandList } from "@/components/dashboard/dashboard-brand-list";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardBrands } from "@/lib/dashboard/queries";

export default async function DashboardBrandsPage() {
  const brands = await getDashboardBrands();

  return (
    <DashboardShell
      title="Brands"
      description="Administrare branduri publice."
    >
      <DashboardBrandForm />
      <DashboardBrandList
        items={brands.map((brand) => ({
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          logoUrl: brand.logoUrl,
          coverImageUrl: brand.coverImageUrl,
          description: brand.description,
          isVisible: brand.isVisible,
        }))}
      />
    </DashboardShell>
  );
}
