import Link from "next/link";
import { redirect } from "next/navigation";
import BrandForm from "@/components/admin/BrandForm";
import UploadForm from "@/components/admin/UploadForm";
import AdminBrandManager from "@/components/admin/AdminBrandManager";
import AdminMediaManager from "@/components/admin/AdminMediaManager";
import { hasAdminSession } from "@/lib/auth/session";
import { logoutAction } from "@/app/actions/auth-actions";
import { prisma } from "@/lib/db/prisma";

export default async function StudioDashboardPage() {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    redirect("/studio-login");
  }

  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="inner-page">
      <div className="inner-topbar admin-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>

        <form action={logoutAction}>
          <button type="submit" className="admin-logout">
            Logout
          </button>
        </form>
      </div>

      <section className="inner-section admin-page-shell">
        <div className="admin-page-header">
          <span className="admin-kicker">Panou privat</span>
          <h1>Studio Dashboard</h1>
          <p className="inner-description">
            Acum brandurile și fișierele sunt citite/scrise din baza de date.
          </p>
        </div>

        <div className="admin-grid">
          <BrandForm brands={brands} onBrandSelect={() => {}} />
          <UploadForm selectedBrand="" />
        </div>

        <div className="admin-grid admin-grid-bottom">
          <AdminBrandManager />
          <AdminMediaManager />
        </div>
      </section>
    </main>
  );
}