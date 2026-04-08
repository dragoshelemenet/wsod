export type CategorySlug =
  | "video"
  | "foto"
  | "grafica"
  | "website"
  | "meta-ads"
  | "audio";

export interface Brand {
  name: string;
  slug: string;
}

export interface Category {
  title: string;
  slug: CategorySlug;
}