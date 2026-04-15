import type { PublicCategory } from "@/types/dashboard";

export const PUBLIC_CATEGORIES: Array<{
  key: PublicCategory;
  label: string;
  description: string;
}> = [
  {
    key: "video",
    label: "Video",
    description: "Portofoliu video public",
  },
  {
    key: "foto",
    label: "Foto",
    description: "Portofoliu foto public",
  },
  {
    key: "grafica",
    label: "Grafica",
    description: "Portofoliu grafica public",
  },
  {
    key: "website",
    label: "Website",
    description: "Proiecte website publice",
  },
  {
    key: "meta-ads",
    label: "Meta Ads",
    description: "Creatii si rezultate Meta Ads",
  },
  {
    key: "audio",
    label: "Audio",
    description: "Proiecte audio si comparatii before/after",
  },
];

export const DASHBOARD_SECTIONS = [
  {
    key: "media",
    label: "Media",
    description: "Toate fisierele media si organizarea lor",
    href: "/studio-dashboard/media",
  },
  {
    key: "brands",
    label: "Brands",
    description: "Foldere brand si ordinea lor",
    href: "/studio-dashboard/brands",
  },
  {
    key: "models",
    label: "Models",
    description: "Foldere model si asocierea cu media",
    href: "/studio-dashboard/models",
  },
  {
    key: "audio",
    label: "Audio",
    description: "Upload before/after pentru sunet",
    href: "/studio-dashboard/audio",
  },
  {
    key: "upload",
    label: "Upload",
    description: "Zona rapida pentru upload si atasare",
    href: "/studio-dashboard/upload",
  },
  {
    key: "site-content",
    label: "Site Content",
    description: "Texte, homepage, pagini si continut global",
    href: "/studio-dashboard/site-content",
  },
  {
    key: "visibility",
    label: "Visibility",
    description: "Publicat, draft, featured si ordine",
    href: "/studio-dashboard/visibility",
  },
  {
    key: "blog",
    label: "Blog",
    description: "Articole blog si continut SEO",
    href: "/studio-dashboard/blog",
  },
  {
    key: "seo",
    label: "SEO",
    description: "Meta title, description, canonical si indexare",
    href: "/studio-dashboard/seo",
  },
] as const;
