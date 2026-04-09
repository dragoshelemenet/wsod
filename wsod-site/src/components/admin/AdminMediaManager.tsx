import { prisma } from "@/lib/db/prisma";
import { deleteMediaAction } from "@/app/actions/admin-actions";

export default async function AdminMediaManager() {
  const mediaItems = await prisma.mediaItem.findMany({
    include: {
      brand: true,
      personModel: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  return (
    <div className="admin-panel-card">
      <div className="admin-card-head">
        <h2>4. Administrare fișiere</h2>
      </div>

      <div className="admin-stack">
        <p className="admin-helper-text">
          Fișierele de aici sunt citite direct din baza de date.
        </p>

        <div className="admin-list">
          {mediaItems.map((item) => {
            const ownerLabel = item.personModel ? "Model" : "Brand";
            const ownerName =
              item.personModel?.name ?? item.brand?.name ?? "Fără asociere";

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
            Nu există fișiere în baza de date momentan.
          </p>
        ) : null}
      </div>
    </div>
  );
}