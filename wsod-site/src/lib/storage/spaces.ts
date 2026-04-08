import { S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env.DO_SPACES_ENDPOINT;
const region = process.env.DO_SPACES_REGION;
const accessKeyId = process.env.DO_SPACES_KEY;
const secretAccessKey = process.env.DO_SPACES_SECRET;

if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
  throw new Error("Missing DigitalOcean Spaces environment variables.");
}

export const spacesClient = new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});