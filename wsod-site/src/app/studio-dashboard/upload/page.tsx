import Link from "next/link";
import { redirect } from "next/navigation";
import UploadToSpacesForm from "@/components/admin/UploadToSpacesForm";
import { hasAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function StudioDashboardUploadPage() {
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
        <Link href="/studio-dashboard" className="back-link">
          ← Dashboard
        </Link>
      </div>

      <section className="inner-section admin-page-shell admin-page-shell-wide">
        <div className="admin-page-header">
          <span className="admin-kicker">Admin</span>
          <h1>Upload media</h1>
        </div>

        <div className="admin-grid admin-grid-single">
          <UploadToSpacesForm
            brands={brands}
            models={models}
            audioProfiles={audioProfiles}
          />
        </div>
      </section>
    </main>
  );
}
