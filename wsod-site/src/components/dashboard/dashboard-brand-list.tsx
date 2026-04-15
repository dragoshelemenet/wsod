"use client";

import { useState } from "react";
import { DashboardBrandForm } from "./dashboard-brand-form";

type BrandItem = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  description?: string | null;
  isVisible?: boolean;
};

type DashboardBrandListProps = {
  items: BrandItem[];
};

export function DashboardBrandList({ items }: DashboardBrandListProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (!items.length) {
    return <p className="admin-helper-text">Nu există branduri încă.</p>;
  }

  return (
    <div className="admin-stack">
      {items.map((brand) => {
        const isOpen = openId === brand.id;

        return (
          <div key={brand.id} className="admin-list-item">
            <div className="admin-card-head">
              <div className="admin-list-copy">
                <strong>{brand.name}</strong>
                <span>{brand.slug}</span>
              </div>

              <div className="admin-inline-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() => setOpenId(isOpen ? null : brand.id)}
                >
                  {isOpen ? "Close" : "Edit"}
                </button>
              </div>
            </div>

            {isOpen ? (
              <DashboardBrandForm
                mode="edit"
                brand={brand}
                onDone={() => setOpenId(null)}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}