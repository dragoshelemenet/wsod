import type { ReactNode } from "react";
import { PublicNavbar } from "@/components/public/public-navbar";
import { PublicFooter } from "@/components/public/public-footer";
import {
  getSiteContentRecord,
  getVisibleHomeSections,
} from "@/lib/dashboard/queries";

type PublicLayoutProps = {
  children: ReactNode;
};

function normalizeSectionKey(value: string) {
  const raw = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  if (raw === "photo" || raw === "foto") return "foto";
  if (raw === "graphic" || raw === "grafica") return "grafica";
  if (raw === "meta-ads" || raw === "meta-ads." || raw === "meta ads") return "meta-ads";
  if (raw === "audio") return "audio";
  if (raw === "video") return "video";
  if (raw === "website" || raw === "website-uri" || raw === "websites") return "website";

  return raw;
}

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const [siteContent, visibleSections] = await Promise.all([
    getSiteContentRecord(),
    getVisibleHomeSections(),
  ]);

  const visibleSectionKeys = new Set(
    (visibleSections || [])
      .filter((item: any) => item.isVisible)
      .flatMap((item: any) => [
        normalizeSectionKey(item.slug || ""),
        normalizeSectionKey(item.label || ""),
        normalizeSectionKey(item.name || ""),
      ])
      .filter(Boolean)
  );

  const links = [
    { href: "/", label: "Home" },
    ...(visibleSectionKeys.has("video") ? [{ href: "/video", label: "Video" }] : []),
    ...(visibleSectionKeys.has("foto") ? [{ href: "/foto", label: "Foto" }] : []),
    ...(visibleSectionKeys.has("grafica") ? [{ href: "/grafica", label: "Grafica" }] : []),
    ...(visibleSectionKeys.has("website") ? [{ href: "/website", label: "Website" }] : []),
    ...(visibleSectionKeys.has("meta-ads") ? [{ href: "/meta-ads", label: "Meta Ads" }] : []),
    ...(visibleSectionKeys.has("audio") ? [{ href: "/audio", label: "Audio" }] : []),
    { href: "/servicii-preturi", label: "Servicii" },
  ];

  return (
    <>
      <PublicNavbar
        logoUrl={siteContent?.homeLogoUrl ?? null}
        links={links}
      />
      {children}
      <PublicFooter />
    </>
  );
}
