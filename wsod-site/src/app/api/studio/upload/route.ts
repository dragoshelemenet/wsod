import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { hasAdminSession } from "@/lib/auth/session";

export const runtime = "nodejs";

function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: NextRequest) {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "No file uploaded" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ ok: false, error: "Only image files are allowed" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || ".png";
    const baseName = path.basename(file.name, ext);
    const safeBase = sanitizeFileName(baseName || "brand-image");
    const unique = crypto.randomBytes(6).toString("hex");
    const fileName = `${safeBase}-${unique}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "brands");
    await mkdir(uploadDir, { recursive: true });

    const fullPath = path.join(uploadDir, fileName);
    await writeFile(fullPath, buffer);

    return NextResponse.json({
      ok: true,
      url: `/uploads/brands/${fileName}`,
      fileName,
    });
  } catch (error) {
    console.error("UPLOAD_BRAND_IMAGE_ERROR", error);
    return NextResponse.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
}
