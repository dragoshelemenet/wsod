import Link from "next/link";
import { redirect } from "next/navigation";
import ModelForm from "@/components/admin/ModelForm";
import { hasAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function StudioDashboardModelsPage() {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    redirect("/studio-login");
  }

  const models = await prisma.personModel.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: {
      _count: {
        select: {
          mediaItems: true,
        },
      },
    },
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
          <h1>Modele</h1>
        </div>

        <div className="admin-grid admin-grid-single">
          <ModelForm initialModels={models} />
        </div>
      </section>
    </main>
  );
}
