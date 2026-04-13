const footerLinks = [
  {
    href: "https://instagram.com/wsod.prod",
    label: "INSTA",
    external: true,
  },
  {
    href: "https://youtube.com",
    label: "YOUTUBE",
    external: true,
  },
  {
    href: "https://tiktok.com",
    label: "TIKTOK",
    external: true,
  },
  {
    href: "tel:+40727205689",
    label: "+40727205689",
    external: false,
  },
  {
    href: "/servicii-preturi",
    label: "CONTACT",
    external: false,
  },
];

export function PublicFooter() {
  return (
    <footer className="reference-footer-v2 public-global-footer">
      {footerLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {link.label}
        </a>
      ))}
    </footer>
  );
}
