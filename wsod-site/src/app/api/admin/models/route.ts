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

export async function POST(request: Request) {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  const portraitImageUrl = String(body.portraitImageUrl || "").trim();
  const description = String(body.description || "").trim();
  const seoTitle = String(body.seoTitle || "").trim();
  const metaDescription = String(body.metaDescription || "").trim();

  if (!name) {
    return NextResponse.json(
      { ok: false, message: "Numele modelului este obligatoriu." },
      { status: 400 }
    );
  }

  const slug = slugify(name);

  const existing = await prisma.personModel.findUnique({
    where: { slug },
  });

  if (existing) {
    return NextResponse.json(
      { ok: false, message: "Modelul există deja." },
      { status: 409 }
    );
  }

  const personModel = await prisma.personModel.create({
    data: {
      name,
      slug,
      portraitImageUrl: portraitImageUrl || null,
      description: description || null,
      seoTitle: seoTitle || null,
      metaDescription: metaDescription || null,
    },
  });

  revalidatePath("/studio-dashboard");
  revalidatePath("/studio-dashboard/models");
  revalidatePath("/foto");

  return NextResponse.json({
    ok: true,
    message: "Model creat.",
    personModel,
  });
}

export async function DELETE(request: Request) {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const id = String(body.id || "").trim();

  if (!id) {
    return NextResponse.json(
      { ok: false, message: "ID model lipsă." },
      { status: 400 }
    );
  }

  const existing = await prisma.personModel.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          mediaItems: true,
        },
      },
    },
  });

  if (!existing) {
    return NextResponse.json(
      { ok: false, message: "Modelul nu există." },
      { status: 404 }
    );
  }

  if ((existing._count?.mediaItems ?? 0) > 0) {
    return NextResponse.json(
      {
        ok: false,
        message: "Modelul are fișiere legate. Mută sau șterge mai întâi media acelui model.",
      },
      { status: 409 }
    );
  }

  await prisma.personModel.delete({
    where: { id },
  });

  revalidatePath("/studio-dashboard");
  revalidatePath("/studio-dashboard/models");
  revalidatePath("/foto");
  revalidatePath(`/model/${existing.slug}`);

  return NextResponse.json({
    ok: true,
    message: "Model șters.",
  });
}
