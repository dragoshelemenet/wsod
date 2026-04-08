"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";

function normalizeSlug(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export async function createBrandAction(formData: FormData): Promise<void> {
  const name = String(formData.get("name") || "").trim();
  const slug = normalizeSlug(String(formData.get("slug") || ""));

  if (!name || !slug) return;

  const existing = await prisma.brand.findUnique({
    where: { slug },
  });

  if (existing) return;

  await prisma.brand.create({
    data: { name, slug },
  });

  revalidatePath("/");
  revalidatePath("/studio-dashboard");
}

export async function updateBrandAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const slug = normalizeSlug(String(formData.get("slug") || ""));

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
    data: { name, slug },
  });

  revalidatePath("/");
  revalidatePath("/studio-dashboard");
}

export async function deleteBrandAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.brand.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/studio-dashboard");
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