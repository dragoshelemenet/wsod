export default function NotFound() {
  return (
    <main className="inner-page">
      <section className="inner-section not-found-page">
        <span className="not-found-code">404</span>
        <h1>Pagina nu exista</h1>
        <p className="inner-description">
          Pagina cautata nu a fost gasita. Verifica linkul sau revino la homepage.
        </p>
        <div className="not-found-actions">
          <a href="/" className="not-found-button">
            Acasa
          </a>
          <a href="/video" className="not-found-button secondary">
            Vezi portofoliu
          </a>
        </div>
      </section>
    </main>
  );
}
