import Link from "next/link";
import {
  getBrandsWithCategoryPreviewFromDb,
  getMediaByCategoryFromDb,
  getModelsWithCategoryPreviewFromDb,
} from "@/lib/data/db-queries";
import { OwnerFolderCard } from "@/components/public/owner-folder-card";
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

function SectionPager({
  currentPage,
  totalPages,
  makeHref,
}: {
  currentPage: number;
  totalPages: number;
  makeHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 12,
        marginTop: 16,
      }}
    >
      {currentPage > 1 ? (
        <Link
          href={makeHref(currentPage - 1)}
          scroll={false}
          aria-label="Previous page"
          style={{
            width: 42,
            height: 42,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.14)",
            display: "grid",
            placeItems: "center",
            textDecoration: "none",
            color: "white",
            background: "rgba(255,255,255,0.04)",
            fontSize: 22,
            lineHeight: 1,
          }}
        >
          ‹
        </Link>
      ) : (
        <span
          style={{
            width: 42,
            height: 42,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.08)",
            display: "grid",
            placeItems: "center",
            color: "rgba(255,255,255,0.28)",
            fontSize: 22,
            lineHeight: 1,
          }}
        >
          ‹
        </span>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          const active = page === currentPage;
          return (
            <Link
              key={page}
              href={makeHref(page)}
              scroll={false}
              aria-label={`Go to page ${page}`}
              style={{
                width: active ? 10 : 8,
                height: active ? 10 : 8,
                borderRadius: 999,
                background: active ? "white" : "rgba(255,255,255,0.28)",
                display: "block",
                textDecoration: "none",
              }}
            />
          );
        })}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={makeHref(currentPage + 1)}
          scroll={false}
          aria-label="Next page"
          style={{
            width: 42,
            height: 42,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.14)",
            display: "grid",
            placeItems: "center",
            textDecoration: "none",
            color: "white",
            background: "rgba(255,255,255,0.04)",
            fontSize: 22,
            lineHeight: 1,
          }}
        >
          ›
        </Link>
      ) : (
        <span
          style={{
            width: 42,
            height: 42,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.08)",
            display: "grid",
            placeItems: "center",
            color: "rgba(255,255,255,0.28)",
            fontSize: 22,
            lineHeight: 1,
          }}
        >
          ›
        </span>
      )}
    </div>
  );
}

function AiBadge() {
  return (
    <div
      className="ai-photo-badge"
      title="Unele elemente au fost schimbate cu AI performant (hainele sau mediu)."
    >
      <span className="ai-photo-badge-icon" aria-hidden="true">
        ✦
      </span>
      <span className="ai-photo-badge-text">Schimbat CU AI</span>
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
      aiMode: (item as any).aiMode || (Boolean((item as any).aiEdited) ? "ai-edit" : ""),
    }));

  const allBrandPhotos = items
    .filter((item) => item.owner?.type === "brand")
    .map((item) => ({
      id: item.id,
      title: item.title,
      href: `/foto/${item.slug}`,
      imageUrl: item.thumbnailUrl || item.previewUrl || item.fileUrl || null,
      aiMode: (item as any).aiMode || (Boolean((item as any).aiEdited) ? "ai-edit" : ""),
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
        <section className="inner-section-block">
          <div className="section-mini-head">
            <h2>Poze cu modele</h2>
          </div>

          <div className="foto-preview-grid">
            {modelPhotosPaginated.items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="foto-preview-grid-link"
              >
                <div className="foto-preview-grid-media">
                  <img
                    src={item.imageUrl || undefined}
                    alt={item.title}
                    className="foto-preview-grid-image"
                  />
                  {item.aiMode ? <AiBadge mode={item.aiMode} /> : null}
                </div>
              </Link>
            ))}
          </div>

          <SectionPager
            currentPage={modelPhotosPaginated.page}
            totalPages={modelPhotosPaginated.totalPages}
            makeHref={(page) => buildHref(urlParams, "mp", page)}
          />
        </section>

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

          <SectionPager
            currentPage={modelsPaginated.page}
            totalPages={modelsPaginated.totalPages}
            makeHref={(page) => buildHref(urlParams, "mo", page)}
          />
        </section>

        <section className="inner-section-block">
          <div className="section-mini-head">
            <h2>Poze brand</h2>
          </div>

          <div className="foto-preview-grid">
            {brandPhotosPaginated.items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="foto-preview-grid-link"
              >
                <div className="foto-preview-grid-media">
                  <img
                    src={item.imageUrl || undefined}
                    alt={item.title}
                    className="foto-preview-grid-image"
                  />
                  {item.aiMode ? <AiBadge mode={item.aiMode} /> : null}
                </div>
              </Link>
            ))}
          </div>

          <SectionPager
            currentPage={brandPhotosPaginated.page}
            totalPages={brandPhotosPaginated.totalPages}
            makeHref={(page) => buildHref(urlParams, "bp", page)}
          />
        </section>

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

          <SectionPager
            currentPage={brandsPaginated.page}
            totalPages={brandsPaginated.totalPages}
            makeHref={(page) => buildHref(urlParams, "br", page)}
          />
        </section>
      </div>
    </PublicShell>
  );
}
