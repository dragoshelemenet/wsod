import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardUploadForm } from "@/components/dashboard/dashboard-upload-form";
import { getDashboardBrands } from "@/lib/dashboard/queries";

export default async function DashboardUploadPage() {
  const brands = await getDashboardBrands();

  return (
    <DashboardShell
      title="Upload"
      description="Zona de upload rapid pentru media items asociate brandurilor."
    >
      <DashboardUploadForm
        brands={brands.map((brand) => ({
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
        }))}
      />
    </DashboardShell>
  );
}
