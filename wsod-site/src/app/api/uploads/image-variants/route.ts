import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/auth/session";
import {
  generateImageThumbnail,
  generateImagePreview,
} from "@/lib/media/image-thumbnails";

export async function POST(request: Request) {
  const isLoggedIn = await hasAdminSession();

  if (!isLoggedIn) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, message: "Fișierul lipsește." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const [thumbnailBuffer, previewBuffer] = await Promise.all([
      generateImageThumbnail(buffer),
      generateImagePreview(buffer),
    ]);

    return NextResponse.json({
      ok: true,
      message: "Variante imagine generate.",
      thumbnailBase64: thumbnailBuffer.toString("base64"),
      previewBase64: previewBuffer.toString("base64"),
      mimeType: "image/jpeg",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Nu s-au putut genera variantele imaginii.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
