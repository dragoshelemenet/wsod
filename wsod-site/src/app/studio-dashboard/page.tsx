import Link from "next/link";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/auth/session";
import { logoutAction } from "@/app/actions/auth-actions";

export default async function StudioDashboardPage() {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    redirect("/studio-login");
  }

  const sections = [
    {
      title: "Branduri",
      description: "Creare și administrare branduri.",
      href: "/studio-dashboard/brands",
      isVisible: true,
    },
    {
      title: "Modele",
      description: "Creare și organizare modele.",
      href: "/studio-dashboard/models",
      isVisible: true,
    },
    {
      title: "Profiluri audio",
      description: "Creare și administrare profiluri audio.",
      href: "/studio-dashboard/audio",
      isVisible: true,
    },
    {
      title: "Upload media",
      description: "Upload separat, mai curat și mai ușor de folosit.",
      href: "/studio-dashboard/upload",
      isVisible: true,
    },
    {
      title: "Media manager",
      description: "Căutare, filtrare și management media într-o pagină separată.",
      href: "/studio-dashboard/media",
      isVisible: true,
    },
    {
      title: "Visibility",
      description: "Ascunzi secțiuni, branduri, modele, audio și alte elemente fără delete.",
      href: "/studio-dashboard/visibility",
      isVisible: true,
    },
    {
      title: "Blog",
      description: "Adaugi articole noi, editezi articole vechi și atașezi media.",
      href: "/studio-dashboard/blog",
      isVisible: true,
    },
  ];

  const visibleSections = sections.filter((section) => section.isVisible);

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
            Adminul este separat pe pagini clare, ca să nu mai fie totul încărcat într-un singur loc.
          </p>
        </div>

        <div className="admin-sections-grid">
          {visibleSections.map((section) => (
            <Link key={section.href} href={section.href} className="admin-section-card">
              <strong>{section.title}</strong>
              <span>{section.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}