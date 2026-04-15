type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="media-breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`}>
            {item.href && !isLast ? (
              <a href={item.href} className="media-breadcrumb-link">
                {item.label}
              </a>
            ) : (
              <span className="media-breadcrumb-current">{item.label}</span>
            )}

            {!isLast ? (
              <span className="media-breadcrumb-separator">/</span>
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}
