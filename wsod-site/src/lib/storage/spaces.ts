import { S3Client } from "@aws-sdk/client-s3";

export function getSpacesClient() {
  const endpoint = process.env.DO_SPACES_ENDPOINT;
  const region = process.env.DO_SPACES_REGION;
  const accessKeyId = process.env.DO_SPACES_KEY;
  const secretAccessKey = process.env.DO_SPACES_SECRET;

  if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    region,
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export function getSpacesConfig() {
  const bucket = process.env.DO_SPACES_BUCKET;
  const region = process.env.DO_SPACES_REGION;
  const cdnUrl = process.env.DO_SPACES_CDN_URL;

  if (!bucket || !region || !cdnUrl) {
    return null;
  }

  return {
    bucket,
    region,
    cdnUrl,
  };
}