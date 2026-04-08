import Link from "next/link";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default function StudioLoginPage() {
  return (
    <main className="inner-page">
      <div className="inner-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>
      </div>

      <section className="inner-section admin-page-shell">
        <div className="admin-page-header">
          <span className="admin-kicker">Panou privat</span>
          <h1>Autentificare</h1>
          <p className="inner-description">
            Acesta este un login demo local pentru testarea structurii admin.
            În etapa următoare îl vom transforma în autentificare reală.
          </p>
        </div>

        <AdminLoginForm />
      </section>
    </main>
  );
}