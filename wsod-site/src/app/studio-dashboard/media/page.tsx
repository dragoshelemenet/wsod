import { DashboardMediaList } from "@/components/dashboard/dashboard-media-list";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardMediaItems } from "@/lib/dashboard/queries";

export default async function DashboardMediaPage() {
  const items = await getDashboardMediaItems();

  return (
    <DashboardShell
      title="Media"
      description="Administrare media pentru toate categoriile publice."
    >
      <DashboardMediaList items={items} />
    </DashboardShell>
  );
}
