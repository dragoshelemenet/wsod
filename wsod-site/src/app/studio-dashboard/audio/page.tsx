import Link from "next/link";
import { redirect } from "next/navigation";
import AudioProfileForm from "@/components/admin/AudioProfileForm";
import { hasAdminSession } from "@/lib/auth/session";

export default async function StudioDashboardAudioPage() {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    redirect("/studio-login");
  }

  return (
    <main className="inner-page">
      <div className="inner-topbar admin-topbar">
        <Link href="/studio-dashboard" className="back-link">
          ← Dashboard
        </Link>
      </div>

      <section className="inner-section admin-page-shell">
        <div className="admin-page-header">
          <span className="admin-kicker">Admin</span>
          <h1>Profiluri audio</h1>
        </div>

        <div className="admin-grid">
          <AudioProfileForm />
        </div>
      </section>
    </main>
  );
}
