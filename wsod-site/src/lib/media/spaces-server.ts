import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const endpoint =
  process.env.SPACES_ENDPOINT ||
  process.env.DO_SPACES_ENDPOINT ||
  process.env.AWS_ENDPOINT_URL_S3 ||
  "";

const region =
  process.env.SPACES_REGION ||
  process.env.DO_SPACES_REGION ||
  process.env.AWS_REGION ||
  "fra1";

const bucket =
  process.env.SPACES_BUCKET ||
  process.env.DO_SPACES_BUCKET ||
  "";

const accessKeyId =
  process.env.SPACES_KEY ||
  process.env.DO_SPACES_KEY ||
  process.env.AWS_ACCESS_KEY_ID ||
  "";

const secretAccessKey =
  process.env.SPACES_SECRET ||
  process.env.DO_SPACES_SECRET ||
  process.env.AWS_SECRET_ACCESS_KEY ||
  "";

if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
  console.warn("Spaces env vars missing. Rotation upload route will fail until env vars exist.");
}

export const spacesBucket = bucket;

export const spacesClient = new S3Client({
  region,
  endpoint: endpoint.startsWith("http") ? endpoint : `https://${endpoint}`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: false,
});

export function makeSpacesPublicUrl(key: string) {
  const cleanEndpoint = endpoint.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  return `https://${bucket}.${cleanEndpoint}/${key}`;
}

export async function uploadBufferToSpaces(params: {
  key: string;
  body: Buffer;
  contentType: string;
  cacheControl?: string;
}) {
  const { key, body, contentType, cacheControl } = params;

  await spacesClient.send(
    new PutObjectCommand({
      Bucket: spacesBucket,
      Key: key,
      Body: body,
      ACL: "public-read",
      ContentType: contentType,
      CacheControl: cacheControl ?? "public, max-age=31536000, immutable",
    })
  );

  return makeSpacesPublicUrl(key);
}
