import Link from "next/link";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import VisibilityManager from "@/components/admin/VisibilityManager";

export default async function StudioDashboardVisibilityPage() {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    redirect("/studio-login");
  }

  const [sections, brands, models, audioProfiles] = await Promise.all([
    prisma.siteSectionVisibility.findMany({ orderBy: { label: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.personModel.findMany({ orderBy: { name: "asc" } }),
    prisma.audioProfile.findMany({ orderBy: { name: "asc" } }),
  ]);

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
          <h1>Visibility</h1>
          <p className="inner-description">
            Ascunzi sau reactivezi secțiuni, branduri, modele, profiluri audio și fișiere fără să le ștergi.
          </p>
        </div>

        <VisibilityManager
          sections={sections}
          brands={brands}
          models={models}
          audioProfiles={audioProfiles}
        />
      </section>
    </main>
  );
}
