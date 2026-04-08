import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hasAdminSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const category = String(body.category || "").trim();
  const type = String(body.type || "").trim();
  const date = String(body.date || "").trim();
  const fileUrl = String(body.fileUrl || "").trim();
  const thumbnail = String(body.thumbnail || "").trim();
  const brandSlug = String(body.brandSlug || "").trim();

  if (!title || !category || !type || !date || !brandSlug) {
    return NextResponse.json(
      { ok: false, message: "Completează câmpurile obligatorii." },
      { status: 400 }
    );
  }

  const brand = await prisma.brand.findUnique({
    where: { slug: brandSlug },
  });

  if (!brand) {
    return NextResponse.json(
      { ok: false, message: "Brandul selectat nu există." },
      { status: 404 }
    );
  }

  await prisma.mediaItem.create({
    data: {
      title,
      description: description || null,
      category,
      type,
      date: new Date(date),
      fileUrl: fileUrl || null,
      thumbnail: thumbnail || null,
      brandId: brand.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/studio-dashboard");
  revalidatePath("/video");
  revalidatePath("/foto");
  revalidatePath("/grafica");
  revalidatePath("/audio");
  revalidatePath("/website");
  revalidatePath("/meta-ads");
  revalidatePath(`/brand/${brand.slug}`);

  return NextResponse.json({
    ok: true,
    message: "Fișier creat.",
  });
}