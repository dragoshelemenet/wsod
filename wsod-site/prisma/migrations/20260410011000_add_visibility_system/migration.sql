ALTER TABLE "Brand" ADD COLUMN "isVisible" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "PersonModel" ADD COLUMN "isVisible" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "AudioProfile" ADD COLUMN "isVisible" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "MediaItem" ADD COLUMN "isVisible" BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE "SiteSectionVisibility" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "key" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "SiteSectionVisibility_key_key" ON "SiteSectionVisibility"("key");

INSERT OR IGNORE INTO "SiteSectionVisibility" ("id", "key", "label", "isVisible", "createdAt", "updatedAt") VALUES
  ('sec_video', 'video', 'VIDEO', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sec_foto', 'foto', 'PHOTO', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sec_grafica', 'grafica', 'GRAPHIC', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sec_website', 'website', 'WEBSITE', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sec_meta_ads', 'meta-ads', 'META ADS', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('sec_audio', 'audio', 'AUDIO', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
