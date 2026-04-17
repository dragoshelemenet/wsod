import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardUploadForm } from "@/components/dashboard/dashboard-upload-form";
import {
  getDashboardBrands,
  getDashboardModels,
  getDashboardTalents,
} from "@/lib/dashboard/queries";

export default async function DashboardUploadPage() {
  const [brands, models, talents] = await Promise.all([
    getDashboardBrands(),
    getDashboardModels(),
    getDashboardTalents(),
  ]);

  return (
    <DashboardShell
      title="Upload"
      description="Zona de upload rapid pentru media items asociate brandurilor, modelelor, artiștilor și influencerilor."
    >
      <DashboardUploadForm
        brands={brands.map((brand) => ({
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
        }))}
        models={models.map((model) => ({
          id: model.id,
          name: model.name,
          slug: model.slug,
        }))}
        talents={talents.map((talent) => ({
          id: talent.id,
          name: talent.name,
          slug: talent.slug,
          kind: talent.kind,
        }))}
      />
    </DashboardShell>
  );
}
