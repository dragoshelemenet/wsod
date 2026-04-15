import Link from "next/link";

interface MediaBreadcrumbsProps {
  categoryLabel: string;
  categoryHref: string;
  ownerName?: string;
  ownerHref?: string | null;
  currentTitle: string;
}

export default function MediaBreadcrumbs({
  categoryLabel,
  categoryHref,
  ownerName,
  ownerHref,
  currentTitle,
}: MediaBreadcrumbsProps) {
  return (
    <nav className="media-breadcrumbs" aria-label="Breadcrumb">
      <Link href="/" className="media-breadcrumb-link">
        Acasă
      </Link>
      <span className="media-breadcrumb-separator">/</span>

      <Link href={categoryHref} className="media-breadcrumb-link">
        {categoryLabel}
      </Link>

      {ownerName && ownerHref ? (
        <>
          <span className="media-breadcrumb-separator">/</span>
          <Link href={ownerHref} className="media-breadcrumb-link">
            {ownerName}
          </Link>
        </>
      ) : null}

      <span className="media-breadcrumb-separator">/</span>
      <span className="media-breadcrumb-current">{currentTitle}</span>
    </nav>
  );
}
