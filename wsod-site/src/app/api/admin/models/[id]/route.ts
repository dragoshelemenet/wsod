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

function revalidateAll(modelSlug?: string) {
  revalidatePath("/");
  revalidatePath("/foto");
  revalidatePath("/studio-dashboard");
  revalidatePath("/studio-dashboard/models");
  if (modelSlug) revalidatePath(`/model/${modelSlug}`);
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
  const portraitImageUrl = String(body.portraitImageUrl || "").trim();
  const hoverPreview1 = String(body.hoverPreview1 || "").trim();
  const hoverPreview2 = String(body.hoverPreview2 || "").trim();
  const hoverPreview3 = String(body.hoverPreview3 || "").trim();
  const description = String(body.description || "").trim();
  const seoTitle = String(body.seoTitle || "").trim();
  const metaDescription = String(body.metaDescription || "").trim();
  const isVisible = Boolean(body.isVisible);

  if (!name) {
    return NextResponse.json(
      { ok: false, message: "Numele modelului este obligatoriu." },
      { status: 400 }
    );
  }

  if (!slug) {
    return NextResponse.json(
      { ok: false, message: "Slug invalid pentru model." },
      { status: 400 }
    );
  }

  const existing = await prisma.personModel.findUnique({
    where: { id },
    select: { id: true, slug: true },
  });

  if (!existing) {
    return NextResponse.json(
      { ok: false, message: "Modelul nu există." },
      { status: 404 }
    );
  }

  const duplicate = await prisma.personModel.findFirst({
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

  const personModel = await prisma.personModel.update({
    where: { id },
    data: {
      name,
      slug,
      portraitImageUrl: portraitImageUrl || null,
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
  if (existing.slug !== personModel.slug) revalidateAll(personModel.slug);

  return NextResponse.json({
    ok: true,
    message: "Model actualizat.",
    personModel,
  });
}
