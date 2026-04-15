import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/auth/session";
import { generateVideoPosterFromBuffer } from "@/lib/media/video-thumbnails";

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

    if (!file.type.startsWith("video/")) {
      return NextResponse.json(
        { ok: false, message: "Fișierul nu este un video." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const posterBuffer = await generateVideoPosterFromBuffer(buffer);

    return NextResponse.json({
      ok: true,
      message: "Poster video generat.",
      posterBase64: posterBuffer.toString("base64"),
      mimeType: "image/jpeg",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Nu s-a putut genera posterul video.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
