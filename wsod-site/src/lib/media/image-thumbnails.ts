import sharp from "sharp";

export async function generateImageThumbnail(buffer: Buffer) {
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
}

export async function generateImagePreview(buffer: Buffer) {
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
}
