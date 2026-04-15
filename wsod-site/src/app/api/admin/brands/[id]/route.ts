import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hasAdminSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function revalidateAll(brandSlug?: string) {
  revalidatePath("/");
  revalidatePath("/foto");
  revalidatePath("/video");
  revalidatePath("/grafica");
  revalidatePath("/website");
  revalidatePath("/meta-ads");
  revalidatePath("/audio");
  revalidatePath("/studio-dashboard");
  revalidatePath("/studio-dashboard/brands");
  revalidatePath("/studio-dashboard/visibility");
  if (brandSlug) revalidatePath(`/brand/${brandSlug}`);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const name = String(body.name || "").trim();
  const slug = slugify(String(body.slug || body.name || ""));
  const logoUrl = String(body.logoUrl || "").trim();
  const coverImageUrl = String(body.coverImageUrl || "").trim();
  const hoverPreview1 = String(body.hoverPreview1 || "").trim();
  const hoverPreview2 = String(body.hoverPreview2 || "").trim();
  const hoverPreview3 = String(body.hoverPreview3 || "").trim();
  const description = String(body.description || "").trim();
  const seoTitle = String(body.seoTitle || "").trim();
  const metaDescription = String(body.metaDescription || "").trim();
  const isVisible = Boolean(body.isVisible);

  if (!name) {
    return NextResponse.json(
      { ok: false, message: "Numele brandului este obligatoriu." },
      { status: 400 }
    );
  }

  if (!slug) {
    return NextResponse.json(
      { ok: false, message: "Slug invalid pentru brand." },
      { status: 400 }
    );
  }

  const existing = await prisma.brand.findUnique({
    where: { id },
    select: { id: true, slug: true },
  });

  if (!existing) {
    return NextResponse.json(
      { ok: false, message: "Brandul nu există." },
      { status: 404 }
    );
  }

  const duplicate = await prisma.brand.findFirst({
    where: {
      slug,
      NOT: { id },
    },
    select: { id: true },
  });

  if (duplicate) {
    return NextResponse.json(
      { ok: false, message: "Slug-ul există deja." },
      { status: 409 }
    );
  }

  const brand = await prisma.brand.update({
    where: { id },
    data: {
      name,
      slug,
      logoUrl: logoUrl || null,
      coverImageUrl: coverImageUrl || null,
      hoverPreview1: hoverPreview1 || null,
      hoverPreview2: hoverPreview2 || null,
      hoverPreview3: hoverPreview3 || null,
      description: description || null,
      seoTitle: seoTitle || null,
      metaDescription: metaDescription || null,
      isVisible,
    },
  });

  revalidateAll(existing.slug);
  if (existing.slug !== brand.slug) revalidateAll(brand.slug);

  return NextResponse.json({
    ok: true,
    message: "Brand actualizat.",
    brand,
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.brand.findUnique({
    where: { id },
    select: { id: true, slug: true },
  });

  if (!existing) {
    return NextResponse.json(
      { ok: false, message: "Brandul nu există." },
      { status: 404 }
    );
  }

  await prisma.brand.delete({
    where: { id },
  });

  revalidateAll(existing.slug);

  return NextResponse.json({
    ok: true,
    message: "Brand șters.",
  });
}
