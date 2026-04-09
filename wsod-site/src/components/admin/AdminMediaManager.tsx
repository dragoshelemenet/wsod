import { prisma } from "@/lib/db/prisma";
import { deleteMediaAction } from "@/app/actions/admin-actions";

interface AdminMediaManagerProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function getSingleParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

export default async function AdminMediaManager({
  searchParams,
}: AdminMediaManagerProps) {
  const params = (await searchParams) ?? {};

  const category = getSingleParam(params.category).trim();
  const ownerType = getSingleParam(params.ownerType).trim();
  const ownerSlug = getSingleParam(params.ownerSlug).trim();
  const search = getSingleParam(params.search).trim();
  const pageParam = Number(getSingleParam(params.page) || "1");
  const sort = getSingleParam(params.sort).trim() === "oldest" ? "oldest" : "newest";

  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { seoTitle: { contains: search } },
      { metaDescription: { contains: search } },
      { fileNameOriginal: { contains: search } },
    ];
  }

  if (ownerType === "brand" && ownerSlug) {
    where.brand = {
      slug: ownerSlug,
    };
  }

  if (ownerType === "model" && ownerSlug) {
    where.personModel = {
      slug: ownerSlug,
    };
  }

  if (ownerType === "audioProfile" && ownerSlug) {
    where.audioProfile = {
      slug: ownerSlug,
    };
  }

  const [mediaItems, totalCount, brands, models, audioProfiles] = await Promise.all([
    prisma.mediaItem.findMany({
      where,
      include: {
        brand: true,
        personModel: true,
        audioProfile: true,
      },
      orderBy: {
        date: sort === "oldest" ? "asc" : "desc",
      },
      take: pageSize,
      skip,
    }),
    prisma.mediaItem.count({
      where,
    }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
    prisma.personModel.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
    prisma.audioProfile.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        kind: true,
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  function buildQuery(nextPage: number) {
    const query = new URLSearchParams();

    if (category) query.set("category", category);
    if (ownerType) query.set("ownerType", ownerType);
    if (ownerSlug) query.set("ownerSlug", ownerSlug);
    if (search) query.set("search", search);
    if (sort) query.set("sort", sort);
    query.set("page", String(nextPage));

    return `?${query.toString()}`;
  }

  return (
    <div className="admin-panel-card">
      <div className="admin-card-head">
        <h2>4. Administrare fișiere</h2>
      </div>

      <div className="admin-stack">
        <p className="admin-helper-text">
          Filtrează, caută și gestionează fișierele fără să încarci toată baza de date odată.
        </p>

        <form method="GET" className="admin-stack">
          <div className="admin-form-field">
            <label htmlFor="category-filter">Categorie</label>
            <select id="category-filter" name="category" className="admin-select" defaultValue={category}>
              <option value="">Toate</option>
              <option value="video">VIDEO</option>
              <option value="foto">PHOTO</option>
              <option value="grafica">GRAPHIC</option>
              <option value="website">WEBSITE</option>
              <option value="meta-ads">META ADS</option>
              <option value="audio">AUDIO</option>
            </select>
          </div>

          <div className="admin-form-field">
            <label htmlFor="owner-type-filter">Tip owner</label>
            <select id="owner-type-filter" name="ownerType" className="admin-select" defaultValue={ownerType}>
              <option value="">Toți</option>
              <option value="brand">Brand</option>
              <option value="model">Model</option>
              <option value="audioProfile">Audio Profile</option>
            </select>
          </div>

          <div className="admin-form-field">
            <label htmlFor="owner-slug-filter">Owner</label>
            <select id="owner-slug-filter" name="ownerSlug" className="admin-select" defaultValue={ownerSlug}>
              <option value="">Toți</option>

              <optgroup label="Branduri">
                {brands.map((brand) => (
                  <option key={`brand-${brand.id}`} value={brand.slug}>
                    {brand.name}
                  </option>
                ))}
              </optgroup>

              <optgroup label="Modele">
                {models.map((model) => (
                  <option key={`model-${model.id}`} value={model.slug}>
                    {model.name}
                  </option>
                ))}
              </optgroup>

              <optgroup label="Audio Profiles">
                {audioProfiles.map((profile) => (
                  <option key={`audio-${profile.id}`} value={profile.slug}>
                    {profile.name} ({profile.kind})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="admin-form-field">
            <label htmlFor="search-filter">Căutare</label>
            <input
              id="search-filter"
              name="search"
              defaultValue={search}
              placeholder="Caută după titlu, descriere, SEO sau nume fișier"
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="sort-filter">Sortare</label>
            <select id="sort-filter" name="sort" className="admin-select" defaultValue={sort}>
              <option value="newest">Cele mai noi</option>
              <option value="oldest">Cele mai vechi</option>
            </select>
          </div>

          <div className="admin-inline-actions">
            <button type="submit" className="admin-submit">
              Aplică filtrele
            </button>

            <a href="/studio-dashboard" className="media-link">
              Resetează
            </a>
          </div>
        </form>

        <p className="admin-helper-text">
          Afișare {mediaItems.length} din {totalCount} rezultate.
        </p>

        <div className="admin-list">
          {mediaItems.map((item) => {
            let ownerLabel = "Fără asociere";
            let ownerName = "Fără asociere";

            if (item.brand) {
              ownerLabel = "Brand";
              ownerName = item.brand.name;
            } else if (item.personModel) {
              ownerLabel = "Model";
              ownerName = item.personModel.name;
            } else if (item.audioProfile) {
              ownerLabel = "Audio";
              ownerName = `${item.audioProfile.name} (${item.audioProfile.kind})`;
            }

            return (
              <div key={item.id} className="admin-list-item">
                <div className="admin-list-copy">
                  <strong>{item.title}</strong>
                  <span>
                    {item.category} • {ownerLabel}: {ownerName} •{" "}
                    {new Date(item.date).toLocaleDateString("ro-RO")}
                  </span>
                </div>

                <div className="admin-inline-actions">
                  <form action={deleteMediaAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="admin-danger-button">
                      Șterge fișier
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>

        {!mediaItems.length ? (
          <p className="admin-helper-text">
            Nu există fișiere pentru filtrele selectate.
          </p>
        ) : null}

        {totalPages > 1 ? (
          <div className="admin-inline-actions">
            {page > 1 ? (
              <a href={buildQuery(page - 1)} className="media-link">
                ← Pagina anterioară
              </a>
            ) : (
              <span className="admin-helper-text">← Pagina anterioară</span>
            )}

            <span className="admin-helper-text">
              Pagina {page} din {totalPages}
            </span>

            {page < totalPages ? (
              <a href={buildQuery(page + 1)} className="media-link">
                Pagina următoare →
              </a>
            ) : (
              <span className="admin-helper-text">Pagina următoare →</span>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}