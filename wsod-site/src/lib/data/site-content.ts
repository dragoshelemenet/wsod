import { prisma } from "@/lib/db/prisma";

const defaults = {
  id: "main",
  servicesEyebrow: "Serviciile noastre",
  servicesTitle: "Servicii & prețuri",
  servicesList: [
    "Creăm conținut video, foto, design și website-uri pentru branduri, artiști și afaceri care vor să arate premium online.",
    "Lucrăm curat, rapid și orientat pe rezultat: portofoliu, social media, reclame și materiale promo.",
    "Mai jos poți prezenta serviciile clar și pachetele într-un mod mai ușor de citit.",
  ].join("\n"),
  servicesCards: [
    "Filmare & montaj video|Videoclipuri promo, reels, interviuri, prezentări de business și content pentru social media.|video, reels, promo",
    "Video AI (conținut hiper-realist)|Vizualuri moderne și creative, realizate cu ajutorul tehnologiilor AI, păstrând un look premium și actual.|ai, reclame, content",
    "Videoclipuri muzicale / lyric videos|Lyric videos, cover visuals, animații pentru piese și materiale promo pentru artiști.|lyric videos, artist",
    "Fotografie & retuș profesional|Ședințe foto, fotografie de produs, business sau personal branding, plus editare și retuș atent.|foto, retus, branding",
    "Grafică pentru branduri|Flyere, bannere, postere, cărți de vizită, certificate și materiale promo.|grafică, print, ads",
    "Cover art pentru piese|Artwork profesional pentru lansări muzicale, streaming platforms și promovare online.|cover art, muzică",
    "Creare website-uri moderne|Website-uri curate, rapide și actuale, potrivite pentru branduri, portofolii și afaceri.|website, business",
    "Audio mixing & mastering|Procesare audio profesională pentru piese, reclame, podcasturi și alte materiale media.|audio, mix, master",
    "Editare podcasturi|Curățare audio, montaj, structurare și optimizare pentru un sunet clar și profesionist.|podcast, editare",
  ].join("\n"),
  packageCards: [
    "Pachet Standard|1 videoclip vertical|298 lei|149 lei|ideal pentru start",
    "Pachet Premium|3 videoclipuri verticale|798 lei|399 lei|mai mult content",
    "Pachet Lux|5 videoclipuri verticale + 20 fotografii|1298 lei|649 lei|ofertă completă",
    "Certificat cadou|Voucher pentru servicii foto/video/grafică|250 lei|199 lei|cadou pentru business",
  ].join("\n"),
  pricingLabel: "Servicii & prețuri",
  pricingHref: "/servicii-preturi",
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
