CREATE TABLE "SiteContent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "servicesEyebrow" TEXT,
  "servicesTitle" TEXT,
  "servicesList" TEXT,
  "pricingLabel" TEXT,
  "pricingHref" TEXT,
  "contactLabel" TEXT,
  "contactHref" TEXT,
  "claimLabel" TEXT,
  "claimHref" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

INSERT OR IGNORE INTO "SiteContent" (
  "id",
  "servicesEyebrow",
  "servicesTitle",
  "servicesList",
  "pricingLabel",
  "pricingHref",
  "contactLabel",
  "contactHref",
  "claimLabel",
  "claimHref",
  "createdAt",
  "updatedAt"
) VALUES (
  'main',
  'Serviciile noastre',
  'Serviciile noastre',
  'Filmare & montaj video\nVideo AI (conținut hiper-realist)\nVideo muzicale (lyric videos)\nFotografii & retuș profesional\nGrafică pentru branduri\nCover art pentru piese\nCreare website-uri moderne\nAudio mixing & mastering\nEditare podcasturi',
  'Prețuri',
  'https://wa.me/40727205689?text=Salut%2C%20vreau%20o%20ofert%C4%83',
  'Contact',
  'https://wa.me/40727205689',
  'Primul video/foto gratis',
  'https://wa.me/40727205689?text=Salut%2C%20vreau%20primul%20video%20sau%20foto%20gratis',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
