-- Redefine Brand to add new optional columns
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Brand" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "coverImageUrl" TEXT,
    "description" TEXT,
    "seoTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "new_Brand" (
    "id", "name", "slug", "createdAt", "updatedAt"
)
SELECT
    "id", "name", "slug", "createdAt", "updatedAt"
FROM "Brand";

DROP TABLE "Brand";
ALTER TABLE "new_Brand" RENAME TO "Brand";
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- Create PersonModel if missing
CREATE TABLE IF NOT EXISTS "PersonModel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "portraitImageUrl" TEXT,
    "description" TEXT,
    "seoTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "PersonModel_slug_key" ON "PersonModel"("slug");

-- Create AudioProfile if missing
CREATE TABLE IF NOT EXISTS "AudioProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "description" TEXT,
    "seoTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "AudioProfile_slug_key" ON "AudioProfile"("slug");

-- Redefine MediaItem to match current schema
CREATE TABLE "new_MediaItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "thumbnailUrl" TEXT,
    "previewUrl" TEXT,
    "fileUrl" TEXT,
    "fileNameOriginal" TEXT,
    "description" TEXT,
    "seoTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "brandId" TEXT,
    "personModelId" TEXT,
    "audioProfileId" TEXT,
    CONSTRAINT "MediaItem_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MediaItem_personModelId_fkey" FOREIGN KEY ("personModelId") REFERENCES "PersonModel" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MediaItem_audioProfileId_fkey" FOREIGN KEY ("audioProfileId") REFERENCES "AudioProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_MediaItem" (
    "id",
    "title",
    "slug",
    "category",
    "type",
    "date",
    "thumbnailUrl",
    "fileUrl",
    "description",
    "createdAt",
    "updatedAt",
    "brandId"
)
SELECT
    "id",
    "title",
    lower(
      trim(
        replace(
          replace(
            replace(
              replace(
                replace(
                  replace(
                    replace(
                      replace(
                        replace("title", ' ', '-'),
                      '--', '-'),
                    '--', '-'),
                  '/', '-'),
                '&', 'and'),
              '''', ''),
            '"', ''),
          ',', ''),
        '.', '')
      )
    ) AS "slug",
    "category",
    "type",
    "date",
    "thumbnail" AS "thumbnailUrl",
    "fileUrl",
    "description",
    "createdAt",
    "updatedAt",
    "brandId"
FROM "MediaItem";

DROP TABLE "MediaItem";
ALTER TABLE "new_MediaItem" RENAME TO "MediaItem";

CREATE UNIQUE INDEX "MediaItem_slug_key" ON "MediaItem"("slug");

CREATE INDEX IF NOT EXISTS "MediaItem_brandId_idx" ON "MediaItem"("brandId");
CREATE INDEX IF NOT EXISTS "MediaItem_personModelId_idx" ON "MediaItem"("personModelId");
CREATE INDEX IF NOT EXISTS "MediaItem_audioProfileId_idx" ON "MediaItem"("audioProfileId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
