import Link from "next/link";
import { redirect } from "next/navigation";
import AdminMediaManager from "@/components/admin/AdminMediaManager";
import { hasAdminSession } from "@/lib/auth/session";

interface StudioDashboardMediaPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function StudioDashboardMediaPage({
  searchParams,
}: StudioDashboardMediaPageProps) {
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
          <h1>Media manager</h1>
        </div>

        <div className="admin-grid">
          <AdminMediaManager searchParams={searchParams} />
        </div>
      </section>
    </main>
  );
}
