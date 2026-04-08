import { Brand, MediaItem } from "@/lib/types";

export const ADMIN_BRANDS_STORAGE_KEY = "wsod_admin_brands";
export const ADMIN_MEDIA_STORAGE_KEY = "wsod_admin_media";

export function saveBrandsToStorage(brands: Brand[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_BRANDS_STORAGE_KEY, JSON.stringify(brands));
}

export function loadBrandsFromStorage(): Brand[] | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(ADMIN_BRANDS_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Brand[];
  } catch {
    return null;
  }
}

export function saveMediaToStorage(mediaItems: MediaItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_MEDIA_STORAGE_KEY, JSON.stringify(mediaItems));
}

export function loadMediaFromStorage(): MediaItem[] | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(ADMIN_MEDIA_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as MediaItem[];
  } catch {
    return null;
  }
}