import { DbMediaCardItem } from "@/lib/types";

const BASE_URL = "https://wsod.cloud";

export function buildMediaJsonLd(item: DbMediaCardItem) {
  const name = item.seoTitle || item.title;
  const description =
    item.metaDescription ||
    item.description ||
    `${item.title} din portofoliul WSOD.PROD.`;

  const url =
    item.category === "foto"
      ? `${BASE_URL}/foto/${item.slug}`
      : item.category === "video"
        ? `${BASE_URL}/video/${item.slug}`
        : item.category === "audio"
          ? `${BASE_URL}/audio/${item.slug}`
          : BASE_URL;

  const image = item.thumbnailUrl || item.previewUrl || item.fileUrl || undefined;
  const uploadDate =
    item.date instanceof Date ? item.date.toISOString() : new Date(item.date).toISOString();

  if (item.category === "foto") {
    return {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      name,
      description,
      contentUrl: item.fileUrl || url,
      url,
      thumbnailUrl: item.thumbnailUrl || item.previewUrl || item.fileUrl || undefined,
      uploadDate,
      creator: {
        "@type": "Organization",
        name: "WSOD.PROD",
      },
    };
  }

  if (item.category === "video") {
    return {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name,
      description,
      contentUrl: item.fileUrl || url,
      url,
      thumbnailUrl: image,
      uploadDate,
      publisher: {
        "@type": "Organization",
        name: "WSOD.PROD",
      },
    };
  }

  if (item.category === "audio") {
    return {
      "@context": "https://schema.org",
      "@type": "AudioObject",
      name,
      description,
      contentUrl: item.fileUrl || url,
      url,
      uploadDate,
      publisher: {
        "@type": "Organization",
        name: "WSOD.PROD",
      },
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url,
  };
}
