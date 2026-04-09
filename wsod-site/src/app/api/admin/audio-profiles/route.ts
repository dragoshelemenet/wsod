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
  const kind = String(body.kind || "").trim();

  if (!name) {
    return NextResponse.json(
      { ok: false, message: "Numele profilului audio este obligatoriu." },
      { status: 400 }
    );
  }

  if (!kind) {
    return NextResponse.json(
      { ok: false, message: "Tipul profilului audio este obligatoriu." },
      { status: 400 }
    );
  }

  const allowedKinds = ["artist", "podcast", "show", "project"];
  if (!allowedKinds.includes(kind)) {
    return NextResponse.json(
      { ok: false, message: "Tip invalid pentru profilul audio." },
      { status: 400 }
    );
  }

  const slug = slugify(name);

  const existing = await prisma.audioProfile.findUnique({
    where: { slug },
  });

  if (existing) {
    return NextResponse.json(
      { ok: false, message: "Profilul audio există deja." },
      { status: 409 }
    );
  }

  const audioProfile = await prisma.audioProfile.create({
    data: {
      name,
      slug,
      kind,
    },
  });

  revalidatePath("/studio-dashboard");
  revalidatePath("/audio");

  return NextResponse.json({
    ok: true,
    message: "Profil audio creat.",
    audioProfile,
  });
}