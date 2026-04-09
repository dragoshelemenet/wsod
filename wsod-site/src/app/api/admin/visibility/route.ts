import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hasAdminSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/foto");
  revalidatePath("/video");
  revalidatePath("/grafica");
  revalidatePath("/website");
  revalidatePath("/meta-ads");
  revalidatePath("/audio");
  revalidatePath("/blog");
  revalidatePath("/studio-dashboard");
  revalidatePath("/studio-dashboard/visibility");
  revalidatePath("/studio-dashboard/media");
}

export async function GET() {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const [sections, brands, models, audioProfiles] = await Promise.all([
    prisma.siteSectionVisibility.findMany({ orderBy: { label: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.personModel.findMany({ orderBy: { name: "asc" } }),
    prisma.audioProfile.findMany({ orderBy: { name: "asc" } }),
  ]);

  return NextResponse.json({
    ok: true,
    sections,
    brands,
    models,
    audioProfiles,
  });
}

export async function PUT(request: Request) {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const entityType = String(body.entityType || "").trim();
  const id = String(body.id || "").trim();
  const isVisible = Boolean(body.isVisible);

  if (!entityType || !id) {
    return NextResponse.json({ ok: false, message: "Date invalide." }, { status: 400 });
  }

  if (entityType === "section") {
    await prisma.siteSectionVisibility.update({
      where: { id },
      data: { isVisible },
    });
  } else if (entityType === "brand") {
    await prisma.brand.update({
      where: { id },
      data: { isVisible },
    });
  } else if (entityType === "model") {
    await prisma.personModel.update({
      where: { id },
      data: { isVisible },
    });
  } else if (entityType === "audioProfile") {
    await prisma.audioProfile.update({
      where: { id },
      data: { isVisible },
    });
  } else if (entityType === "mediaItem") {
    await prisma.mediaItem.update({
      where: { id },
      data: { isVisible },
    });
  } else {
    return NextResponse.json({ ok: false, message: "Tip necunoscut." }, { status: 400 });
  }

  revalidateAll();

  return NextResponse.json({
    ok: true,
    message: "Visibility actualizat.",
  });
}
