PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_PersonModel" (
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

INSERT INTO "new_PersonModel" (
    "id",
    "name",
    "slug",
    "description",
    "seoTitle",
    "metaDescription",
    "createdAt",
    "updatedAt"
)
SELECT
    "id",
    "name",
    "slug",
    "description",
    "seoTitle",
    "metaDescription",
    "createdAt",
    "updatedAt"
FROM "PersonModel";

DROP TABLE "PersonModel";
ALTER TABLE "new_PersonModel" RENAME TO "PersonModel";

CREATE UNIQUE INDEX IF NOT EXISTS "PersonModel_slug_key" ON "PersonModel"("slug");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
