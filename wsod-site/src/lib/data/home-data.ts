import { Brand, Category } from "@/lib/types";

export const homeCategories: Category[] = [
  { title: "VIDEO", slug: "video" },
  { title: "PHOTO", slug: "foto" },
  { title: "GRAPHIC", slug: "grafica" },
  { title: "WEBSITE", slug: "website" },
  { title: "META ADS", slug: "meta-ads" },
  { title: "AUDIO", slug: "audio" },
];

export const featuredBrands: Brand[] = [
  { name: "Coca-Cola", slug: "coca-cola" },
  { name: "Samsung", slug: "samsung" },
  { name: "ING Bank", slug: "ing-bank" },
];

export function getBrandNameBySlug(slug: string) {
  return featuredBrands.find((brand) => brand.slug === slug)?.name ?? slug;
}

export function getCategoryLabel(slug: string) {
  return homeCategories.find((category) => category.slug === slug)?.title ?? slug;
}