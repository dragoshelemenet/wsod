import { DashboardAudioProfileForm } from "@/components/dashboard/dashboard-audio-profile-form";
import { DashboardAudioProfileList } from "@/components/dashboard/dashboard-audio-profile-list";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardAudioProfiles } from "@/lib/dashboard/queries";

export default async function DashboardAudioPage() {
  const items = await getDashboardAudioProfiles();

  return (
    <DashboardShell
      title="Audio"
      description="Administrare audio profiles si legarea lor la proiecte."
    >
      <DashboardAudioProfileForm />
      <DashboardAudioProfileList items={items} />
    </DashboardShell>
  );
}
