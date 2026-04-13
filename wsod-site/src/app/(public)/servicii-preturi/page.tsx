import { CategoryHero } from "@/components/public/category-hero";
import { PublicShell } from "@/components/public/public-shell";

export default function ServiciiPreturiPage() {
  return (
    <PublicShell
      title="Servicii si preturi"
      description="Pagina pentru servicii, pachete si preturi, simpla, clara si rapida."
    >
      <CategoryHero
        title="Servicii si preturi"
        description="Aici vor fi listate serviciile, pachetele si preturile, intr-un mod clar, usor de scanat si optim pentru conversie."
      />

      <section className="services-shell">
        <article className="service-price-card">
          <div className="service-price-top">
            <h2>Video</h2>
            <span className="service-price-badge">Popular</span>
          </div>
          <p className="service-price-description">
            Pachete pentru clipuri video, reels, reclame si proiecte comerciale.
          </p>
        </article>

        <article className="service-price-card">
          <div className="service-price-top">
            <h2>Foto</h2>
            <span className="service-price-badge">Rapid</span>
          </div>
          <p className="service-price-description">
            Sedinte foto, selectie imagini, editare si livrare curata.
          </p>
        </article>

        <article className="service-price-card">
          <div className="service-price-top">
            <h2>Grafica</h2>
            <span className="service-price-badge">Creative</span>
          </div>
          <p className="service-price-description">
            Vizualuri, cover-uri, materiale promo si assets pentru brand.
          </p>
        </article>

        <article className="service-price-card">
          <div className="service-price-top">
            <h2>Website</h2>
            <span className="service-price-badge">Modern</span>
          </div>
          <p className="service-price-description">
            Website-uri rapide, curate, optimizate pentru SEO si conversie.
          </p>
        </article>

        <article className="service-price-card">
          <div className="service-price-top">
            <h2>Meta Ads</h2>
            <span className="service-price-badge">Ads</span>
          </div>
          <p className="service-price-description">
            Creatii si structuri pentru campanii Meta Ads si continut promo.
          </p>
        </article>

        <article className="service-price-card">
          <div className="service-price-top">
            <h2>Audio</h2>
            <span className="service-price-badge">Before / After</span>
          </div>
          <p className="service-price-description">
            Procesare audio, comparatie clara intre sunetul initial si rezultatul final.
          </p>
        </article>
      </section>
    </PublicShell>
  );
}
