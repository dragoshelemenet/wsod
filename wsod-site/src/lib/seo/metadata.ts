type MetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://wsod.ro";

const SITE_NAME = "WSOD";

export function buildMetadata(input: MetadataInput) {
  const canonicalPath = input.path ? `/${input.path.replace(/^\/+/, "")}` : "";
  const canonical = `${SITE_URL}${canonicalPath}`;

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical,
    },
    robots: {
      index: !input.noindex,
      follow: !input.noindex,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: SITE_NAME,
      images: input.image ? [{ url: input.image }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: input.image ? [input.image] : [],
    },
  };
}
