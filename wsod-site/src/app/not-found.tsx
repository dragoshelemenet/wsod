import Link from "next/link";

export default function NotFound() {
  return (
    <main className="inner-page">
      <section className="inner-section not-found-page">
        <span className="not-found-code">404</span>
        <h1>Pagina nu a fost găsită</h1>
        <p className="inner-description">
          Linkul accesat nu există sau a fost mutat. Poți reveni la pagina
          principală sau la blog. Servici Digitale wsod.prod +727205689.
        </p>

        <div className="not-found-actions">
          <Link href="/" className="not-found-button">
            Acasă
          </Link>
          <Link href="/blog" className="not-found-button secondary">
            Blog
          </Link>
        </div>
      </section>
    </main>
  );
}