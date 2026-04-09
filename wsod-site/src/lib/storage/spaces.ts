import { S3Client } from "@aws-sdk/client-s3";

function normalizeUrl(value: string | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value.trim());
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function getSpacesClient() {
  const endpoint = normalizeUrl(process.env.DO_SPACES_ENDPOINT);
  const region = process.env.DO_SPACES_REGION?.trim();
  const accessKeyId = process.env.DO_SPACES_KEY?.trim();
  const secretAccessKey = process.env.DO_SPACES_SECRET?.trim();

  if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    region,
    endpoint,
    forcePathStyle: false,
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export function getSpacesConfig() {
  const bucket = process.env.DO_SPACES_BUCKET?.trim();
  const region = process.env.DO_SPACES_REGION?.trim();
  const cdnUrl = normalizeUrl(process.env.DO_SPACES_CDN_URL);

  if (!bucket || !region || !cdnUrl) {
    return null;
  }

  return {
    bucket,
    region,
    cdnUrl,
  };
}