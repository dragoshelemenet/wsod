import { DashboardMediaEditList } from "@/components/dashboard/dashboard-media-edit-list";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import {
  getDashboardAudioProfiles,
  getDashboardBrands,
  getDashboardMediaItems,
  getDashboardModels,
} from "@/lib/dashboard/queries";

export default async function DashboardMediaPage() {
  const [items, brands, models, audioProfiles] = await Promise.all([
    getDashboardMediaItems(),
    getDashboardBrands(),
    getDashboardModels(),
    getDashboardAudioProfiles(),
  ]);

  return (
    <DashboardShell
      title="Media"
      description="Administrare media pentru toate categoriile publice."
    >
      <DashboardMediaEditList
        items={items}
        brands={brands.map((item) => ({ id: item.id, name: item.name }))}
        models={models.map((item) => ({ id: item.id, name: item.name }))}
        audioProfiles={audioProfiles.map((item) => ({ id: item.id, name: item.name }))}
      />
    </DashboardShell>
  );
}
