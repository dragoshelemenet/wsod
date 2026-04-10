import { getSiteContentFromDb } from "@/lib/data/site-content";
import HeroClient from "@/components/home/HeroClient";

export default async function Hero() {
  const content = await getSiteContentFromDb();

  const contactHref = content.contactHref || "https://wa.me/40727205689";
  const claimHref =
    content.claimHref ||
    "https://wa.me/40727205689?text=Salut%2C%20vreau%20primul%20video%20sau%20foto%20gratis";

  return (
    <HeroClient
      pricingHref={content.pricingHref || "/servicii-preturi"}
      pricingLabel={content.pricingLabel || "Servicii & prețuri"}
      contactHref={contactHref}
      contactLabel={content.contactLabel || "Contact"}
      claimHref={claimHref}
      claimLabel={content.claimLabel || "Primul video/foto gratis"}
    />
  );
}
