import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { hasAdminSession } from "@/lib/auth/session";

function revalidateCommonPaths() {
  revalidatePath("/");
  revalidatePath("/foto");
  revalidatePath("/video");
  revalidatePath("/grafica");
  revalidatePath("/website");
  revalidatePath("/meta-ads");
  revalidatePath("/audio");
  revalidatePath("/servicii-preturi");
  revalidatePath("/studio-dashboard/media");
  revalidatePath("/studio-dashboard/visibility");
}

export async function POST(request: Request) {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const ids = Array.isArray(body?.ids)
    ? body.ids.map((value: unknown) => String(value)).filter(Boolean)
    : [];

  if (!ids.length) {
    return NextResponse.json(
      { ok: false, message: "Nu ai selectat niciun fișier." },
      { status: 400 }
    );
  }

  const existing = await prisma.mediaItem.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      slug: true,
      category: true,
      brand: { select: { slug: true } },
      personModel: { select: { slug: true } },
      audioProfile: { select: { slug: true } },
    },
  });

  if (!existing.length) {
    return NextResponse.json(
      { ok: false, message: "Fișierele selectate nu există." },
      { status: 404 }
    );
  }

  await prisma.blogPostMedia.deleteMany({
    where: { mediaItemId: { in: existing.map((item) => item.id) } },
  });

  await prisma.mediaItem.deleteMany({
    where: { id: { in: existing.map((item) => item.id) } },
  });

  revalidateCommonPaths();

  for (const item of existing) {
    revalidatePath(`/foto/${item.slug}`);
    revalidatePath(`/video/${item.slug}`);
    revalidatePath(`/grafica/${item.slug}`);
    revalidatePath(`/website/${item.slug}`);
    revalidatePath(`/meta-ads/${item.slug}`);
    revalidatePath(`/audio/${item.slug}`);

    if (item.brand?.slug) revalidatePath(`/brand/${item.brand.slug}`);
    if (item.personModel?.slug) revalidatePath(`/model/${item.personModel.slug}`);
    if (item.audioProfile?.slug) revalidatePath(`/audio-profile/${item.audioProfile.slug}`);
  }

  return NextResponse.json({
    ok: true,
    message: `${existing.length} fișiere au fost șterse.`,
    deletedCount: existing.length,
  });
}
