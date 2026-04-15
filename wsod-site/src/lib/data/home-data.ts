import { Brand, Category } from "@/lib/types";

export const homeCategories: Category[] = [
  { title: "VIDEO", slug: "video" },
  { title: "PHOTO", slug: "foto" },
  { title: "GRAFICĂ", slug: "grafica" },
  { title: "WEBSITE", slug: "website" },
  { title: "META ADS", slug: "meta-ads" },
  { title: "AUDIO", slug: "audio" },
];

export const defaultFeaturedBrands: Brand[] = [
  { name: "Coca-Cola", slug: "coca-cola" },
  { name: "Samsung", slug: "samsung" },
  { name: "ING Bank", slug: "ing-bank" },
];

export const featuredBrands = defaultFeaturedBrands;

export function getBrandNameBySlug(slug: string, brands: Brand[] = featuredBrands) {
  return brands.find((brand) => brand.slug === slug)?.name ?? slug;
}

export function getCategoryLabel(slug: string) {
  return homeCategories.find((category) => category.slug === slug)?.title ?? slug;
}