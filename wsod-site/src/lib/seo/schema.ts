export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "WSOD.PROD",
    url: "https://example.com",
    telephone: "+40727205689",
    sameAs: [
      "https://instagram.com/",
      "https://youtube.com/",
      "https://tiktok.com/",
    ],
  };
}

export function createBlogPostingSchema({
  title,
  description,
  url,
  datePublished,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    datePublished,
    author: {
      "@type": "Organization",
      name: "WSOD.PROD",
    },
    publisher: {
      "@type": "Organization",
      name: "WSOD.PROD",
    },
  };
}