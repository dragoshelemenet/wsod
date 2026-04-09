import sharp from "sharp";

export async function generateImageThumbnail(buffer: Buffer) {
  try {
    const thumbnailBuffer = await sharp(buffer)
      .resize({
        width: 900,
        height: 900,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 78,
        mozjpeg: true,
      })
      .toBuffer();

    return thumbnailBuffer;
  } catch (error) {
    throw new Error(
      `Thumbnail generation failed. Ensure sharp is installed and working. ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function generateImagePreview(buffer: Buffer) {
  try {
    const previewBuffer = await sharp(buffer)
      .resize({
        width: 1600,
        height: 1600,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 86,
        mozjpeg: true,
      })
      .toBuffer();

    return previewBuffer;
  } catch (error) {
    throw new Error(
      `Preview generation failed. Ensure sharp is installed and working. ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
