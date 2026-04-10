import { prisma } from "@/lib/db/prisma";

const defaults = {
  id: "main",
  servicesEyebrow: "Serviciile noastre",
  servicesTitle: "Serviciile noastre",
  servicesList: [
    "Filmare & montaj video",
    "Video AI (conținut hiper-realist)",
    "Video muzicale (lyric videos)",
    "Fotografii & retuș profesional",
    "Grafică pentru branduri",
    "Cover art pentru piese",
    "Creare website-uri moderne",
    "Audio mixing & mastering",
    "Editare podcasturi",
  ].join("\\n"),
  pricingLabel: "Prețuri",
  pricingHref: "https://wa.me/40727205689?text=Salut%2C%20vreau%20o%20ofert%C4%83",
  contactLabel: "Contact",
  contactHref: "https://wa.me/40727205689",
  claimLabel: "Primul video/foto gratis",
  claimHref:
    "https://wa.me/40727205689?text=Salut%2C%20vreau%20primul%20video%20sau%20foto%20gratis",
};

export async function getSiteContentFromDb() {
  const row = await prisma.siteContent.findUnique({
    where: { id: "main" },
  });

  return {
    ...defaults,
    ...(row || {}),
  };
}
