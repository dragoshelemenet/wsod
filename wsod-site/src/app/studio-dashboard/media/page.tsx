import Link from "next/link";
import { redirect } from "next/navigation";
import AdminMediaManager from "@/components/admin/AdminMediaManager";
import { hasAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export default async function StudioDashboardMediaPage() {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    redirect("/studio-login");
  }

  const mediaItems = await prisma.mediaItem.findMany({
    orderBy: [{ updatedAt: "desc" }],
    take: 200,
    include: {
      brand: { select: { name: true, slug: true } },
      personModel: { select: { name: true, slug: true } },
      audioProfile: { select: { name: true, slug: true, kind: true } },
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
          <h1>Media manager</h1>
          <p className="inner-description">
            Editezi grouping, ordine, featured și metadata pentru media existentă.
          </p>
        </div>

        <div className="admin-grid admin-grid-single">
          <AdminMediaManager initialItems={mediaItems} />
        </div>
      </section>
    </main>
  );
}
