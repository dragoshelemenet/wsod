import Link from "next/link";
import { redirect } from "next/navigation";
import BrandForm from "@/components/admin/BrandForm";
import AdminBrandManager from "@/components/admin/AdminBrandManager";
import { hasAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function StudioDashboardBrandsPage() {
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
        <Link href="/studio-dashboard" className="back-link">
          ← Dashboard
        </Link>
      </div>

      <section className="inner-section admin-page-shell">
        <div className="admin-page-header">
          <span className="admin-kicker">Admin</span>
          <h1>Branduri</h1>
        </div>

        <div className="admin-grid">
          <BrandForm brands={brands} />
          <AdminBrandManager />
        </div>
      </section>
    </main>
  );
}
