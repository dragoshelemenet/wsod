import type { PublicCategory } from "@/types/dashboard";

export const PUBLIC_CATEGORIES: PublicCategory[] = [
  "video",
  "foto",
  "grafica",
  "website",
  "meta-ads",
  "audio",
];

export const DASHBOARD_SECTIONS = [
  { key: "media", label: "Media" },
  { key: "models", label: "Modele" },
  { key: "brands", label: "Branduri" },
  { key: "audio", label: "Audio before/after" },
  { key: "upload", label: "Upload" },
  { key: "site-content", label: "Site content" },
  { key: "visibility", label: "Visibility" },
  { key: "blog", label: "Blog" },
  { key: "seo", label: "SEO" },
] as const;
