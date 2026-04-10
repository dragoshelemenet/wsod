import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { hasAdminSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getSiteContentFromDb } from "@/lib/data/site-content";

async function saveSiteContent(formData: FormData) {
  "use server";

  const isLoggedIn = await hasAdminSession();
  if (!isLoggedIn) {
    redirect("/studio-login");
  }

  const clean = (key: string) => {
    const value = String(formData.get(key) || "").trim();
    return value.length ? value : null;
  };

  await prisma.siteContent.upsert({
    where: { id: "main" },
    create: {
      id: "main",
      servicesEyebrow: clean("servicesEyebrow"),
      servicesTitle: clean("servicesTitle"),
      servicesList: clean("servicesList"),
      servicesCards: clean("servicesCards"),
      pricingLabel: clean("pricingLabel"),
      pricingHref: clean("pricingHref"),
      contactLabel: clean("contactLabel"),
      contactHref: clean("contactHref"),
      claimLabel: clean("claimLabel"),
      claimHref: clean("claimHref"),
    },
    update: {
      servicesEyebrow: clean("servicesEyebrow"),
      servicesTitle: clean("servicesTitle"),
      servicesList: clean("servicesList"),
      servicesCards: clean("servicesCards"),
      pricingLabel: clean("pricingLabel"),
      pricingHref: clean("pricingHref"),
      contactLabel: clean("contactLabel"),
      contactHref: clean("contactHref"),
      claimLabel: clean("claimLabel"),
      claimHref: clean("claimHref"),
    },
  });

  revalidatePath("/");
  revalidatePath("/servicii-preturi");
  revalidatePath("/studio-dashboard/site-content");
}

export default async function SiteContentDashboardPage() {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    redirect("/studio-login");
  }

  const content = await getSiteContentFromDb();

  return (
    <main className="inner-page">
      <div className="inner-topbar admin-topbar">
        <Link href="/studio-dashboard" className="back-link">
          ← Dashboard
        </Link>
      </div>

      <section className="inner-section admin-page-shell">
        <div className="admin-page-header">
          <span className="admin-kicker">Homepage + Servicii</span>
          <h1>Site content</h1>
          <p className="inner-description">
            Aici modifici textele din homepage și pagina Servicii & prețuri fără cod.
          </p>
        </div>

        <form action={saveSiteContent} className="site-content-form">
          <div className="site-content-grid">
            <label className="admin-field">
              <span>Eyebrow</span>
              <input
                name="servicesEyebrow"
                defaultValue={content.servicesEyebrow || ""}
                className="admin-input"
              />
            </label>

            <label className="admin-field">
              <span>Titlu secțiune / pagină</span>
              <input
                name="servicesTitle"
                defaultValue={content.servicesTitle || ""}
                className="admin-input"
              />
            </label>

            <label className="admin-field site-content-full">
              <span>Listă scurtă homepage — un serviciu pe rând</span>
              <textarea
                name="servicesList"
                defaultValue={content.servicesList || ""}
                className="admin-textarea"
                rows={10}
              />
            </label>

            <label className="admin-field site-content-full">
              <span>Carduri servicii — format: Titlu | Descriere | Preț</span>
              <textarea
                name="servicesCards"
                defaultValue={content.servicesCards || ""}
                className="admin-textarea"
                rows={14}
              />
            </label>

            <label className="admin-field">
              <span>Label meniu servicii</span>
              <input
                name="pricingLabel"
                defaultValue={content.pricingLabel || ""}
                className="admin-input"
              />
            </label>

            <label className="admin-field">
              <span>Link pagină servicii</span>
              <input
                name="pricingHref"
                defaultValue={content.pricingHref || ""}
                className="admin-input"
              />
            </label>

            <label className="admin-field">
              <span>Label contact</span>
              <input
                name="contactLabel"
                defaultValue={content.contactLabel || ""}
                className="admin-input"
              />
            </label>

            <label className="admin-field">
              <span>Link contact</span>
              <input
                name="contactHref"
                defaultValue={content.contactHref || ""}
                className="admin-input"
              />
            </label>

            <label className="admin-field">
              <span>Label gratis</span>
              <input
                name="claimLabel"
                defaultValue={content.claimLabel || ""}
                className="admin-input"
              />
            </label>

            <label className="admin-field">
              <span>Link gratis</span>
              <input
                name="claimHref"
                defaultValue={content.claimHref || ""}
                className="admin-input"
              />
            </label>
          </div>

          <div className="site-content-actions">
            <button type="submit" className="media-open-button">
              Salvează
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
