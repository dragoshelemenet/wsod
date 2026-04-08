import { prisma } from "@/lib/db/prisma";
import { createBrandAction, deleteBrandAction, updateBrandAction } from "@/app/actions/admin-actions";

export default async function AdminBrandManager() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="admin-panel-card">
      <div className="admin-card-head">
        <h2>3. Administrare branduri</h2>
      </div>

      <div className="admin-stack">
        <p className="admin-helper-text">
          Brandurile de aici sunt acum citite și modificate direct din baza de date.
        </p>

        <div className="admin-list">
          {brands.map((brand) => (
            <div key={brand.id} className="admin-list-item admin-list-item-column">
              <form action={updateBrandAction} className="admin-stack">
                <input type="hidden" name="id" value={brand.id} />

                <div className="admin-form-field">
                  <label htmlFor={`name-${brand.id}`}>Nume brand</label>
                  <input
                    id={`name-${brand.id}`}
                    name="name"
                    type="text"
                    defaultValue={brand.name}
                  />
                </div>

                <div className="admin-form-field">
                  <label htmlFor={`slug-${brand.id}`}>Slug brand</label>
                  <input
                    id={`slug-${brand.id}`}
                    name="slug"
                    type="text"
                    defaultValue={brand.slug}
                  />
                </div>

                <div className="admin-inline-actions">
                  <button type="submit" className="admin-secondary-button">
                    Salvează
                  </button>
                </div>
              </form>

              <form action={deleteBrandAction}>
                <input type="hidden" name="id" value={brand.id} />
                <button type="submit" className="admin-danger-button">
                  Șterge brand
                </button>
              </form>
            </div>
          ))}
        </div>

        <div className="admin-panel-card admin-inner-card">
          <h3 className="admin-subtitle">Creează brand nou</h3>

          <form action={createBrandAction} className="admin-stack">
            <div className="admin-form-field">
              <label htmlFor="create-brand-name">Nume brand</label>
              <input
                id="create-brand-name"
                name="name"
                type="text"
                placeholder="Ex: Mosimo Barbershop"
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="create-brand-slug">Slug brand</label>
              <input
                id="create-brand-slug"
                name="slug"
                type="text"
                placeholder="Ex: mosimo-barbershop"
              />
            </div>

            <div className="admin-inline-actions">
              <button type="submit" className="admin-secondary-button">
                Creează brand
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}