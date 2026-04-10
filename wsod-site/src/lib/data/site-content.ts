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
  ].join("\n"),
  servicesCards: [
    "Filmare & montaj video|Reels, reclame, content pentru branduri, filmări comerciale și edit profesional adaptat pentru social media sau website.|de la 150€",
    "Video AI (conținut hiper-realist)|Cadre și reclame generate AI, integrate natural în stil premium, pentru promovare rapidă și vizual puternic.|de la 120€",
    "Video muzicale (lyric videos)|Lyric videos animate, compoziții cinematice, cover art animat și vizualuri sincronizate cu piesa.|de la 80€",
    "Fotografii & retuș profesional|Ședințe foto, cadre comerciale și retuș premium cu look curat, modern și realist.|de la 100€",
    "Grafică pentru branduri|Postări, bannere, ads creatives, identitate vizuală și materiale promo în stil coerent.|de la 60€",
    "Cover art pentru piese|Cover-uri pentru Spotify, Apple Music, YouTube și campanii promo pentru lansări muzicale.|de la 50€",
    "Creare website-uri moderne|Site-uri moderne, rapide, responsive, cu design premium și structură clară pentru portofoliu sau business.|de la 250€",
    "Audio mixing & mastering|Mix și master pentru piese, voice-over, reclame sau proiecte audio comerciale.|de la 70€",
    "Editare podcasturi|Curățare audio, montaj, tăieri, intro/outro și export final pentru podcast video sau audio.|de la 60€",
  ].join("\n"),
  pricingLabel: "Serviciile noastre",
  pricingHref: "/servicii-preturi",
  contactLabel: "Contact",
  contactHref: "https://wa.me/40727205689",
  claimLabel: "Claim your first video/photo for free",
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
