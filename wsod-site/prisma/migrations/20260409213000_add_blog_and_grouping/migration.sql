PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "BlogPost" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "excerpt" TEXT,
  "contentHtml" TEXT NOT NULL,
  "seoTitle" TEXT,
  "metaDescription" TEXT,
  "coverImageUrl" TEXT,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "publishedAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
CREATE INDEX "BlogPost_status_idx" ON "BlogPost"("status");
CREATE INDEX "BlogPost_publishedAt_idx" ON "BlogPost"("publishedAt");

CREATE TABLE "BlogPostMedia" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "blogPostId" TEXT NOT NULL,
  "mediaItemId" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BlogPostMedia_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "BlogPostMedia_mediaItemId_fkey" FOREIGN KEY ("mediaItemId") REFERENCES "MediaItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "BlogPostMedia_blogPostId_mediaItemId_key" ON "BlogPostMedia"("blogPostId","mediaItemId");
CREATE INDEX "BlogPostMedia_blogPostId_idx" ON "BlogPostMedia"("blogPostId");
CREATE INDEX "BlogPostMedia_mediaItemId_idx" ON "BlogPostMedia"("mediaItemId");

ALTER TABLE "MediaItem" ADD COLUMN "groupLabel" TEXT;
ALTER TABLE "MediaItem" ADD COLUMN "groupOrder" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "MediaItem" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "MediaItem" ADD COLUMN "graphicKind" TEXT;
ALTER TABLE "MediaItem" ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "MediaItem_category_idx" ON "MediaItem"("category");
CREATE INDEX "MediaItem_groupLabel_idx" ON "MediaItem"("groupLabel");
CREATE INDEX "MediaItem_graphicKind_idx" ON "MediaItem"("graphicKind");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
