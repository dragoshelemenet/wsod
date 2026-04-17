import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hasAdminSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function makeUniqueSlug(baseSlug: string, excludeId?: string) {
  const cleanBase = slugify(baseSlug) || "media-item";
  let slug = cleanBase;
  let counter = 2;

  while (true) {
    const existing = await prisma.mediaItem.findFirst({
      where: excludeId
        ? {
            slug,
            NOT: { id: excludeId },
          }
        : { slug },
      select: { id: true },
    });

    if (!existing) return slug;

    slug = `${cleanBase}-${counter}`;
    counter += 1;
  }
}

async function revalidateMediaPaths(existing: {
  slug: string;
  brand?: { slug: string } | null;
  personModel?: { slug: string } | null;
  audioProfile?: { slug: string } | null;
}) {
  revalidatePath("/");
  revalidatePath("/foto");
  revalidatePath("/video");
  revalidatePath("/grafica");
  revalidatePath("/website");
  revalidatePath("/meta-ads");
  revalidatePath("/audio");
  revalidatePath("/studio-dashboard/media");
  revalidatePath("/studio-dashboard/visibility");

  revalidatePath(`/foto/${existing.slug}`);
  revalidatePath(`/video/${existing.slug}`);
  revalidatePath(`/grafica/${existing.slug}`);
  revalidatePath(`/website/${existing.slug}`);
  revalidatePath(`/meta-ads/${existing.slug}`);
  revalidatePath(`/audio/${existing.slug}`);

  if (existing.brand?.slug) revalidatePath(`/brand/${existing.brand.slug}`);
  if (existing.personModel?.slug) revalidatePath(`/model/${existing.personModel.slug}`);
  if (existing.audioProfile?.slug) revalidatePath(`/audio-profile/${existing.audioProfile.slug}`);
}

async function handleUpdate(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const title = String(body.title || "").trim();
  const manualSlug = String(body.slug || "").trim();
  const description = String(body.description || "").trim();
  const thumbnailUrl = String(body.thumbnailUrl || "").trim();
  const previewUrl = String(body.previewUrl || "").trim();
  const fileUrl = String(body.fileUrl || "").trim();
  const beforeAiUrl = String(body.beforeAiUrl || "").trim();
  const seoTitle = String(body.seoTitle || "").trim();
  const metaDescription = String(body.metaDescription || "").trim();
  const groupLabel = String(body.groupLabel || "").trim();
  const graphicKind = String(body.graphicKind || "").trim();
  const videoKindRaw = String(body.videoKind || "").trim();
  const videoKind = videoKindRaw === "lyrics" ? "lyrics" : null;
  const videoFormatRaw = String(body.videoFormat || "").trim();
  const videoFormat = ["portrait-9x16", "wide-16x9", "square-1x1"].includes(videoFormatRaw)
    ? videoFormatRaw
    : "portrait-9x16";
  const groupOrder = Number(body.groupOrder ?? 0);
  const sortOrder = Number(body.sortOrder ?? 0);
  const isFeatured = Boolean(body.isFeatured);
  const isVisible = Boolean(body.isVisible);
  const aiModeRaw = String(body.aiMode || "").trim();
  const aiMode =
    aiModeRaw === "ai" || aiModeRaw === "ai-edit" || aiModeRaw === "ai-enhanced"
      ? aiModeRaw
      : null;
  const aiEdited = Boolean(body.aiEdited || aiMode);
  const showOnServices = Boolean(body.showOnServices);
  const rotationRaw = Number(body.rotation ?? 0);
  const normalizedRotation =
    rotationRaw === 90 || rotationRaw === 180 || rotationRaw === 270 ? rotationRaw : 0;

  const brandId =
    body.brandId === null || body.brandId === "" || body.brandId === undefined
      ? null
      : String(body.brandId);

  const personModelId =
    body.personModelId === null || body.personModelId === "" || body.personModelId === undefined
      ? null
      : String(body.personModelId);

  const audioProfileId =
    body.audioProfileId === null || body.audioProfileId === "" || body.audioProfileId === undefined
      ? null
      : String(body.audioProfileId);

  let parsedDate: Date | undefined;
  if (body.date) {
    const maybeDate = new Date(body.date);
    if (!Number.isNaN(maybeDate.getTime())) {
      parsedDate = maybeDate;
    }
  }

  const existing = await prisma.mediaItem.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      title: true,
      brand: { select: { slug: true } },
      personModel: { select: { slug: true } },
      audioProfile: { select: { slug: true } },
    },
  });

  if (!existing) {
    return NextResponse.json(
      { ok: false, message: "Fișierul nu există." },
      { status: 404 }
    );
  }

  const nextTitle = title || existing.title;
  const slugBase = manualSlug || nextTitle || "media-item";
  const nextSlug = await makeUniqueSlug(slugBase, id);

  if (existing && body.category === "foto" && aiMode && !beforeAiUrl) {
    return NextResponse.json(
      { ok: false, message: "Pentru pozele cu AI trebuie să existe și imaginea before AI." },
      { status: 400 }
    );
  }

  const updated = await prisma.mediaItem.update({
    where: { id },
    data: {
      title: nextTitle,
      slug: nextSlug,
      description: description || null,
      thumbnailUrl: thumbnailUrl || null,
      previewUrl: previewUrl || null,
      fileUrl: fileUrl || null,
      beforeAiUrl: beforeAiUrl || null,
      brandId,
      personModelId,
      audioProfileId,
      seoTitle: seoTitle || null,
      metaDescription: metaDescription || null,
      groupLabel: groupLabel || null,
      graphicKind: graphicKind || null,
      showOnServices,
      videoKind,
      videoFormat,
      groupOrder: Number.isFinite(groupOrder) ? groupOrder : 0,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      isFeatured,
      isVisible,
      aiEdited,
      aiMode,
      ...(parsedDate ? { date: parsedDate } : {}),
    },
  });

  await revalidateMediaPaths(existing);

  if (updated.slug !== existing.slug) {
    await revalidateMediaPaths({
      ...existing,
      slug: updated.slug,
    });
  }

  return NextResponse.json({
    ok: true,
    message: "Fișier actualizat.",
    mediaItem: updated,
  });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return handleUpdate(request, context);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return handleUpdate(request, context);
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

  const existing = await prisma.mediaItem.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      title: true,
      brand: { select: { slug: true } },
      personModel: { select: { slug: true } },
      audioProfile: { select: { slug: true } },
    },
  });

  if (!existing) {
    return NextResponse.json(
      { ok: false, message: "Fișierul nu există." },
      { status: 404 }
    );
  }

  await prisma.blogPostMedia.deleteMany({
    where: { mediaItemId: id },
  });

  await prisma.mediaItem.delete({
    where: { id },
  });

  await revalidateMediaPaths(existing);

  return NextResponse.json({
    ok: true,
    message: "Fișierul a fost șters din site și baza de date.",
  });
}