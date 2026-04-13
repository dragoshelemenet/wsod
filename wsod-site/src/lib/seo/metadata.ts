export const defaultMetadata = {
  siteName: "WSOD",
  title: "WSOD",
  description:
    "Portofoliu media premium: video, foto, grafica, website, meta ads si audio.",
};

export function buildPageTitle(title?: string | null) {
  if (!title) return defaultMetadata.title;
  return `${title} | ${defaultMetadata.siteName}`;
}
