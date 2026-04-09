import Link from "next/link";
import { redirect } from "next/navigation";
import BrandForm from "@/components/admin/BrandForm";
import UploadToSpacesForm from "@/components/admin/UploadToSpacesForm";
import AdminBrandManager from "@/components/admin/AdminBrandManager";
import AdminMediaManager from "@/components/admin/AdminMediaManager";
import { hasAdminSession } from "@/lib/auth/session";
import { logoutAction } from "@/app/actions/auth-actions";
import { prisma } from "@/lib/db/prisma";

interface StudioDashboardPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function StudioDashboardPage({
  searchParams,
}: StudioDashboardPageProps) {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    redirect("/studio-login");
  }

  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });

  const models = await prisma.personModel.findMany({
    orderBy: { name: "asc" },
  });

  const audioProfiles = await prisma.audioProfile.findMany({
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
            Acum poți urca fișiere direct în DigitalOcean Spaces și salva
            automat URL-urile în baza de date.
          </p>
        </div>

        <div className="admin-grid">
          <BrandForm brands={brands} />
          <UploadToSpacesForm
            brands={brands}
            models={models}
            audioProfiles={audioProfiles}
          />
        </div>

        <div className="admin-grid admin-grid-bottom">
          <AdminBrandManager />
          <AdminMediaManager searchParams={searchParams} />
        </div>
      </section>
    </main>
  );
}