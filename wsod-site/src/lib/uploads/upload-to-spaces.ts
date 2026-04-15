type PresignResponse = {
  uploadUrl?: string;
  publicUrl?: string;
  fileUrl?: string;
  objectKey?: string;
  error?: string;
};

export async function uploadToSpaces(params: {
  file: File;
  brandSlug: string;
  category: string;
}) {
  const presignResponse = await fetch("/api/uploads/presign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: params.file.name,
      contentType: params.file.type || "application/octet-stream",
      brandSlug: params.brandSlug,
      category: params.category,
    }),
  });

  const presignData = (await presignResponse.json().catch(() => ({}))) as PresignResponse;

  const uploadUrl = presignData.uploadUrl;
  const finalUrl = presignData.fileUrl || presignData.publicUrl || "";
  const objectKey = presignData.objectKey || "";

  if (!presignResponse.ok || !uploadUrl || !finalUrl || !objectKey) {
    throw new Error(presignData.error || "Presign failed.");
  }

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": params.file.type || "application/octet-stream",
    },
    body: params.file,
  });

  if (!uploadResponse.ok) {
    throw new Error("Upload failed.");
  }

  const publicResponse = await fetch("/api/uploads/make-public", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ objectKey }),
  });

  const publicData = await publicResponse.json().catch(() => ({}));

  if (!publicResponse.ok) {
    throw new Error(publicData?.error || "Uploaded, but could not make public.");
  }

  return {
    url: finalUrl,
    objectKey,
  };
}
