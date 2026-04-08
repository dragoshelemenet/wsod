"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BrandForm from "@/components/admin/BrandForm";
import UploadForm from "@/components/admin/UploadForm";
import AdminBrandManager from "@/components/admin/AdminBrandManager";
import AdminMediaManager from "@/components/admin/AdminMediaManager";
import { ADMIN_ROUTE } from "@/lib/auth/mock-auth";

export default function StudioDashboardPage() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("wsod_admin_logged_in") === "true";

    if (!isLoggedIn) {
      router.replace(ADMIN_ROUTE);
      return;
    }

    setIsReady(true);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("wsod_admin_logged_in");
    router.push(ADMIN_ROUTE);
  }

  if (!isReady) {
    return (
      <main className="inner-page">
        <section className="inner-section admin-page-shell">
          <p className="inner-description">Se verifică accesul...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="inner-page">
      <div className="inner-topbar admin-topbar">
        <Link href="/" className="back-link">
          ← Acasă
        </Link>

        <button type="button" className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <section className="inner-section admin-page-shell">
        <div className="admin-page-header">
          <span className="admin-kicker">Panou privat</span>
          <h1>Studio Dashboard</h1>
          <p className="inner-description">
            Fluxul tău: selectezi brand existent sau creezi brand nou, alegi
            categoria, apoi upload-ul se deblochează.
          </p>
        </div>

        <div className="admin-grid">
          <BrandForm onBrandSelect={setSelectedBrand} />
          <UploadForm selectedBrand={selectedBrand} />
        </div>

        <div className="admin-grid admin-grid-bottom">
          <AdminBrandManager />
          <AdminMediaManager />
        </div>
      </section>
    </main>
  );
}