import Link from "next/link";
import {
  getBrandsWithCategoryPreviewFromDb,
  getMediaByCategoryFromDb,
  getModelsWithCategoryPreviewFromDb,
} from "@/lib/data/db-queries";
import { OwnerFolderCard } from "@/components/public/owner-folder-card";
import PreviewRail from "@/components/public/PreviewRail";
import { PublicShell } from "@/components/public/public-shell";

type FotoPageProps = {
  searchParams?: Promise<{
    mp?: string;
    mo?: string;
    bp?: string;
    br?: string;
  }>;
};

function clampPage(value: string | undefined, totalPages: number) {
  const n = Number(value || "1");
  if (!Number.isFinite(n) || n < 1) return 1;
  if (n > totalPages) return totalPages;
  return n;
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    totalPages,
    page: safePage,
  };
}

function buildHref(
  params: URLSearchParams,
  key: "mp" | "mo" | "bp" | "br",
  value: number
) {
  const next = new URLSearchParams(params.toString());
  next.set(key, String(value));
  return `/foto?${next.toString()}`;
}

function PaginationBar({
  currentPage,
  totalPages,
  makeHref,
}: {
  currentPage: number;
  totalPages: number;
  makeHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        marginTop: 16,
      }}
    >
      {currentPage > 1 ? (
        <Link
          href={makeHref(currentPage - 1)}
          style={{
            border: "1px solid rgba(255,255,255,0.14)",
            padding: "8px 12px",
            textDecoration: "none",
            color: "white",
          }}
        >
          {"<"}
        </Link>
      ) : null}

      {pages.map((page) => (
        <Link
          key={page}
          href={makeHref(page)}
          style={{
            border: "1px solid rgba(255,255,255,0.14)",
            padding: "8px 12px",
            textDecoration: "none",
            color: "white",
            background: page === currentPage ? "rgba(255,255,255,0.12)" : "transparent",
          }}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link
          href={makeHref(currentPage + 1)}
          style={{
            border: "1px solid rgba(255,255,255,0.14)",
            padding: "8px 12px",
            textDecoration: "none",
            color: "white",
          }}
        >
          {">"}
        </Link>
      ) : null}
    </div>
  );
}

export default async function FotoPage({ searchParams }: FotoPageProps) {
  const resolvedParams = (await searchParams) || {};
  const urlParams = new URLSearchParams();

  if (resolvedParams.mp) urlParams.set("mp", resolvedParams.mp);
  if (resolvedParams.mo) urlParams.set("mo", resolvedParams.mo);
  if (resolvedParams.bp) urlParams.set("bp", resolvedParams.bp);
  if (resolvedParams.br) urlParams.set("br", resolvedParams.br);

  const [items, allModels, allBrands] = await Promise.all([
    getMediaByCategoryFromDb("foto", { limit: 400 }),
    getModelsWithCategoryPreviewFromDb("foto"),
    getBrandsWithCategoryPreviewFromDb("foto"),
  ]);

  const allModelPhotos = items
    .filter((item) => item.owner?.type === "model")
    .map((item) => ({
      id: item.id,
      title: item.title,
      href: `/foto/${item.slug}`,
      imageUrl: item.thumbnailUrl || item.previewUrl || item.fileUrl || null,
      showPlayIcon: false,
    }));

  const allBrandPhotos = items
    .filter((item) => item.owner?.type === "brand")
    .map((item) => ({
      id: item.id,
      title: item.title,
      href: `/foto/${item.slug}`,
      imageUrl: item.thumbnailUrl || item.previewUrl || item.fileUrl || null,
      showPlayIcon: false,
    }));

  const models = allModels.filter(
    (item) => Array.isArray(item.previewImages) && item.previewImages.length > 0
  );

  const brands = allBrands.filter(
    (item) => Array.isArray(item.previewImages) && item.previewImages.length > 0
  );

  const MODEL_PHOTOS_PER_PAGE = 16;
  const MODELS_PER_PAGE = 16;
  const BRAND_PHOTOS_PER_PAGE = 16;
  const BRANDS_PER_PAGE = 8;

  const modelPhotosTotalPages = Math.max(1, Math.ceil(allModelPhotos.length / MODEL_PHOTOS_PER_PAGE));
  const modelsTotalPages = Math.max(1, Math.ceil(models.length / MODELS_PER_PAGE));
  const brandPhotosTotalPages = Math.max(1, Math.ceil(allBrandPhotos.length / BRAND_PHOTOS_PER_PAGE));
  const brandsTotalPages = Math.max(1, Math.ceil(brands.length / BRANDS_PER_PAGE));

  const modelPhotosPage = clampPage(resolvedParams.mp, modelPhotosTotalPages);
  const modelsPage = clampPage(resolvedParams.mo, modelsTotalPages);
  const brandPhotosPage = clampPage(resolvedParams.bp, brandPhotosTotalPages);
  const brandsPage = clampPage(resolvedParams.br, brandsTotalPages);

  const modelPhotosPaginated = paginate(allModelPhotos, modelPhotosPage, MODEL_PHOTOS_PER_PAGE);
  const modelsPaginated = paginate(models, modelsPage, MODELS_PER_PAGE);
  const brandPhotosPaginated = paginate(allBrandPhotos, brandPhotosPage, BRAND_PHOTOS_PER_PAGE);
  const brandsPaginated = paginate(brands, brandsPage, BRANDS_PER_PAGE);

  return (
    <PublicShell title="Foto">
      <div className="foto-index-page">
        <PreviewRail title="Poze cu modele" items={modelPhotosPaginated.items} />
        <PaginationBar
          currentPage={modelPhotosPaginated.page}
          totalPages={modelPhotosPaginated.totalPages}
          makeHref={(page) => buildHref(urlParams, "mp", page)}
        />

        <section className="inner-section-block">
          <div className="section-mini-head">
            <h2>Modele</h2>
          </div>

          <div className="public-owner-folder-grid foto-model-folder-grid">
            {modelsPaginated.items.map((item) => (
              <OwnerFolderCard
                key={item.id}
                title={item.name}
                href={`/model/${item.slug}`}
                imageUrl={item.previewImages?.[0] || null}
              />
            ))}
          </div>

          <PaginationBar
            currentPage={modelsPaginated.page}
            totalPages={modelsPaginated.totalPages}
            makeHref={(page) => buildHref(urlParams, "mo", page)}
          />
        </section>

        <PreviewRail title="Poze brand" items={brandPhotosPaginated.items} />
        <PaginationBar
          currentPage={brandPhotosPaginated.page}
          totalPages={brandPhotosPaginated.totalPages}
          makeHref={(page) => buildHref(urlParams, "bp", page)}
        />

        <section className="inner-section-block">
          <div className="section-mini-head">
            <h2>Branduri</h2>
          </div>

          <div className="public-owner-folder-grid foto-brand-folder-grid">
            {brandsPaginated.items.map((item) => (
              <OwnerFolderCard
                key={item.id}
                title={item.name}
                href={`/brand/${item.slug}`}
                imageUrl={item.previewImages?.[0] || null}
              />
            ))}
          </div>

          <PaginationBar
            currentPage={brandsPaginated.page}
            totalPages={brandsPaginated.totalPages}
            makeHref={(page) => buildHref(urlParams, "br", page)}
          />
        </section>
      </div>
    </PublicShell>
  );
}
