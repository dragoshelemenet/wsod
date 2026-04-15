import {
  getMediaByCategoryFromDb,
  getModelsWithCategoryPreviewFromDb,
} from "@/lib/data/db-queries";
import HomeServicesCarouselClient from "@/components/home/HomeServicesCarouselClient";

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  imageSrc?: string | null;
  videoSrc?: string | null;
};

function isImageUrl(url?: string | null) {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"].some((ext) =>
    clean.endsWith(ext)
  );
}

function isVideoUrl(url?: string | null) {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return [".mp4", ".webm", ".mov", ".m4v", ".ogg"].some((ext) =>
    clean.endsWith(ext)
  );
}

function getBestImageSrc(item: {
  thumbnailUrl?: string | null;
  previewUrl?: string | null;
  fileUrl?: string | null;
}) {
  return (
    [item.thumbnailUrl, item.previewUrl, item.fileUrl].find((url) =>
      isImageUrl(url)
    ) || null
  );
}

function getBestVideoSrc(item: {
  thumbnailUrl?: string | null;
  previewUrl?: string | null;
  fileUrl?: string | null;
}) {
  return (
    [item.fileUrl, item.previewUrl, item.thumbnailUrl].find((url) =>
      isVideoUrl(url)
    ) || null
  );
}

export default async function HomeServicesCarousel() {
  const [videoItems, photoItems, graphicItems, websiteItems, modelItems] =
    await Promise.all([
      getMediaByCategoryFromDb("video", { limit: 1 }),
      getMediaByCategoryFromDb("foto", { limit: 1 }),
      getMediaByCategoryFromDb("grafica", { limit: 1 }),
      getMediaByCategoryFromDb("website", { limit: 1 }),
      getModelsWithCategoryPreviewFromDb("foto"),
    ]);

  const model = modelItems[0] || null;

  const slides: Slide[] = [];

  if (videoItems[0]) {
    slides.push({
      id: "video",
      title: "VIDEO VIRALE",
      subtitle: "Reels, content și reclame care atrag atenția rapid.",
      href: "/video",
      imageSrc: getBestImageSrc(videoItems[0]),
      videoSrc: getBestVideoSrc(videoItems[0]),
    });
  }

  if (photoItems[0]) {
    slides.push({
      id: "foto",
      title: "POZE FABULOASE",
      subtitle: "Cadre curate, premium și gata pentru social media.",
      href: "/foto",
      imageSrc: getBestImageSrc(photoItems[0]),
      videoSrc: null,
    });
  }

  if (graphicItems[0]) {
    slides.push({
      id: "grafica",
      title: "GRAFICE PENTRU AFACEREA TA",
      subtitle: "Vizualuri moderne pentru ads, postări și branding.",
      href: "/grafica",
      imageSrc: getBestImageSrc(graphicItems[0]),
      videoSrc: null,
    });
  }

  if (websiteItems[0]) {
    slides.push({
      id: "website",
      title: "WEBSITE-URI ACCESIBILE",
      subtitle: "Site-uri moderne, rapide și clare pentru business-ul tău.",
      href: "/website",
      imageSrc: getBestImageSrc(websiteItems[0]),
      videoSrc: null,
    });
  }

  if (model) {
    slides.push({
      id: "modele",
      title: "TOTUL PENTRU AFACEREA TA",
      subtitle: "Foto, video, design și pachete avantajoase pentru brand.",
      href: `/model/${model.slug}`,
      imageSrc: model.portraitImageUrl || model.previewImages?.[0] || null,
      videoSrc: null,
    });
  }

  if (!slides.length) return null;

  return (
    <section className="section services-carousel-section">
      <div className="services-carousel-copy">
        <p className="services-carousel-kicker">Servicii în carousel</p>
      </div>

      <HomeServicesCarouselClient slides={slides} />
    </section>
  );
}
