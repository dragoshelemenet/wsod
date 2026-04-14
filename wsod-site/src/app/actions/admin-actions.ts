"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

function normalizeSlug(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export async function createBrandAction(formData: FormData): Promise<void> {
  const name = String(formData.get("name") || "").trim();
  const slug = normalizeSlug(String(formData.get("slug") || ""));
  const coverImageUrl = String(formData.get("coverImageUrl") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const isVisible = String(formData.get("isVisible") || "true") === "true";

  if (!name || !slug) return;

  const existing = await prisma.brand.findUnique({
    where: { slug },
  });

  if (existing) return;

  await prisma.brand.create({
    data: {
      name,
      slug,
      coverImageUrl: coverImageUrl || null,
      description: description || null,
      isVisible,
    },
  });

  revalidatePath("/");
  revalidatePath("/brand");
  revalidatePath("/foto");
  revalidatePath("/video");
  revalidatePath("/grafica");
  revalidatePath("/website");
  revalidatePath("/studio-dashboard");
  revalidatePath("/studio-dashboard/brands");
}

export async function updateBrandAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const slug = normalizeSlug(String(formData.get("slug") || ""));
  const coverImageUrl = String(formData.get("coverImageUrl") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const isVisible = String(formData.get("isVisible") || "true") === "true";

  if (!id || !name || !slug) return;

  const conflict = await prisma.brand.findFirst({
    where: {
      slug,
      NOT: { id },
    },
  });

  if (conflict) return;

  await prisma.brand.update({
    where: { id },
    data: {
      name,
      slug,
      coverImageUrl: coverImageUrl || null,
      description: description || null,
      isVisible,
    },
  });

  revalidatePath("/");
  revalidatePath("/brand");
  revalidatePath("/foto");
  revalidatePath("/video");
  revalidatePath("/grafica");
  revalidatePath("/website");
  revalidatePath("/studio-dashboard");
  revalidatePath("/studio-dashboard/brands");
}

export async function deleteBrandAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.brand.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/brand");
  revalidatePath("/foto");
  revalidatePath("/video");
  revalidatePath("/grafica");
  revalidatePath("/website");
  revalidatePath("/studio-dashboard");
  revalidatePath("/studio-dashboard/brands");
}

export async function deleteMediaAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.mediaItem.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/video");
  revalidatePath("/foto");
  revalidatePath("/grafica");
  revalidatePath("/audio");
  revalidatePath("/website");
  revalidatePath("/meta-ads");
  revalidatePath("/studio-dashboard");
}
