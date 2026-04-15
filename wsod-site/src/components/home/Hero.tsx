import { getSiteContentFromDb } from "@/lib/data/site-content";
import HeroClient from "./HeroClient";

export default async function Hero() {
  const content = await getSiteContentFromDb();

  const contactHref = content.contactHref || "https://wa.me/40727205689";
  const claimHref =
    content.claimHref ||
    "https://wa.me/40727205689?text=Salut%2C%20vreau%20primul%20video%20sau%20foto%20gratis";

  return (
    <HeroClient
      logoUrl={content.homeLogoUrl || ""}
      contactHref={contactHref}
      claimHref={claimHref}
      contactLabel={content.contactLabel || "Contact"}
      claimLabel={content.claimLabel || "Primul video/foto gratis"}
    />
  );
}
