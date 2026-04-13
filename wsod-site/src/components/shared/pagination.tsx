type PaginationProps = {
  prevHref?: string;
  nextHref?: string;
};

export function Pagination({ prevHref, nextHref }: PaginationProps) {
  return (
    <nav className="grid-pagination" aria-label="Pagination">
      <a
        href={prevHref || "#"}
        className="grid-page-btn"
        aria-disabled={!prevHref}
      >
        ‹
      </a>

      <span className="grid-page-indicator">Pagina</span>

      <a
        href={nextHref || "#"}
        className="grid-page-btn"
        aria-disabled={!nextHref}
      >
        ›
      </a>
    </nav>
  );
}
