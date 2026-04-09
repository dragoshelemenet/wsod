import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hasAdminSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

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

  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const seoTitle = String(body.seoTitle || "").trim();
  const metaDescription = String(body.metaDescription || "").trim();
  const groupLabel = String(body.groupLabel || "").trim();
  const graphicKind = String(body.graphicKind || "").trim();
  const groupOrder = Number(body.groupOrder ?? 0);
  const sortOrder = Number(body.sortOrder ?? 0);
  const isFeatured = Boolean(body.isFeatured);

  const existing = await prisma.mediaItem.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
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

  const updated = await prisma.mediaItem.update({
    where: { id },
    data: {
      title: title || undefined,
      description: description || null,
      seoTitle: seoTitle || null,
      metaDescription: metaDescription || null,
      groupLabel: groupLabel || null,
      graphicKind: graphicKind || null,
      groupOrder: Number.isFinite(groupOrder) ? groupOrder : 0,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      isFeatured,
    },
  });

  await revalidateMediaPaths(existing);

  return NextResponse.json({
    ok: true,
    message: "Fișier actualizat.",
    mediaItem: updated,
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

  const existing = await prisma.mediaItem.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
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
