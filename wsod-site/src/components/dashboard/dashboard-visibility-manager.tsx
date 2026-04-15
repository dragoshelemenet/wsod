"use client";

import { useEffect, useState } from "react";

type VisibilityItem = {
  id: string;
  label?: string;
  name?: string;
  slug?: string;
  isVisible: boolean;
};

type VisibilityPayload = {
  ok: boolean;
  sections: VisibilityItem[];
  brands: VisibilityItem[];
  models: VisibilityItem[];
  audioProfiles: VisibilityItem[];
};

type VisibilityGroupProps = {
  title: string;
  entityType: "section" | "brand" | "model" | "audioProfile";
  items: VisibilityItem[];
  onToggle: (entityType: "section" | "brand" | "model" | "audioProfile", id: string, isVisible: boolean) => Promise<void>;
};

function VisibilityGroup({
  title,
  entityType,
  items,
  onToggle,
}: VisibilityGroupProps) {
  return (
    <section className="admin-panel-card">
      <div className="admin-card-head">
        <h2>{title}</h2>
      </div>

      <div className="admin-list">
        {items.length ? (
          items.map((item) => (
            <article key={item.id} className="admin-list-item">
              <div className="admin-list-copy">
                <strong>{item.label || item.name || "Untitled"}</strong>
                {item.slug ? <span>Slug: {item.slug}</span> : null}
                <span>Vizibil: {item.isVisible ? "Da" : "Nu"}</span>
              </div>

              <label className="admin-toggle-row">
                <span>Visible</span>
                <input
                  type="checkbox"
                  checked={item.isVisible}
                  onChange={(event) =>
                    onToggle(entityType, item.id, event.target.checked)
                  }
                />
              </label>
            </article>
          ))
        ) : (
          <div className="empty-state-block">
            <h3>Empty</h3>
            <p>Nu exista elemente in aceasta sectiune.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export function DashboardVisibilityManager() {
  const [data, setData] = useState<VisibilityPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadData() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/visibility", {
        cache: "no-store",
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || "Nu s-a putut incarca visibility.");
      }

      setData(payload);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscuta.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function onToggle(
    entityType: "section" | "brand" | "model" | "audioProfile",
    id: string,
    isVisible: boolean
  ) {
    setMessage("");

    try {
      const response = await fetch("/api/admin/visibility", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entityType,
          id,
          isVisible,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message || "Nu s-a putut salva visibility.");
      }

      setMessage("Visibility actualizat.");
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscuta.");
    }
  }

  if (loading) {
    return (
      <div className="empty-state-block">
        <h3>Loading visibility...</h3>
        <p>Se incarca datele.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="empty-state-block">
        <h3>No data</h3>
        <p>Nu s-au putut incarca datele de visibility.</p>
      </div>
    );
  }

  return (
    <div className="admin-stack">
      {message ? <p className="admin-helper-text">{message}</p> : null}

      <VisibilityGroup
        title="Site Sections"
        entityType="section"
        items={data.sections || []}
        onToggle={onToggle}
      />

      <VisibilityGroup
        title="Brands"
        entityType="brand"
        items={data.brands || []}
        onToggle={onToggle}
      />

      <VisibilityGroup
        title="Models"
        entityType="model"
        items={data.models || []}
        onToggle={onToggle}
      />

      <VisibilityGroup
        title="Audio Profiles"
        entityType="audioProfile"
        items={data.audioProfiles || []}
        onToggle={onToggle}
      />
    </div>
  );
}
