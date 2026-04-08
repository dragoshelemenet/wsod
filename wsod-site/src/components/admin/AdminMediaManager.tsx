"use client";

import { useMemo, useState } from "react";
import { mediaItems as initialMediaItems } from "@/lib/data/media-data";
import { homeCategories, getBrandNameBySlug } from "@/lib/data/home-data";
import { MediaItem } from "@/lib/types";

export default function AdminMediaManager() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMediaItems);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredItems = useMemo(() => {
    const base =
      selectedCategory === "all"
        ? mediaItems
        : mediaItems.filter((item) => item.category === selectedCategory);

    return [...base].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [mediaItems, selectedCategory]);

  function removeItem(itemId: string) {
    setMediaItems((current) => current.filter((item) => item.id !== itemId));
  }

  function moveItemToNextCategory(itemId: string) {
    const currentIndex = homeCategories.findIndex(
      (category) => category.slug ===
        mediaItems.find((item) => item.id === itemId)?.category
    );

    const nextCategory =
      homeCategories[(currentIndex + 1) % homeCategories.length]?.slug;

    setMediaItems((current) =>
      current.map((item) =>
        item.id === itemId && nextCategory
          ? { ...item, category: nextCategory }
          : item
      )
    );
  }

  return (
    <div className="admin-panel-card">
      <div className="admin-card-head">
        <h2>4. Administrare fișiere</h2>
      </div>

      <div className="admin-stack">
        <div className="admin-form-field">
          <label htmlFor="admin-filter-category">Filtrează după categorie</label>
          <select
            id="admin-filter-category"
            className="admin-select"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="all">Toate categoriile</option>
            {homeCategories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-list">
          {filteredItems.map((item) => (
            <div key={item.id} className="admin-list-item">
              <div className="admin-list-copy">
                <strong>{item.title}</strong>
                <span>
                  {item.category} • {getBrandNameBySlug(item.brandSlug)} •{" "}
                  {new Date(item.date).toLocaleDateString("ro-RO")}
                </span>
              </div>

              <div className="admin-inline-actions">
                <button
                  type="button"
                  className="admin-ghost-button"
                  onClick={() => moveItemToNextCategory(item.id)}
                >
                  Mută categorie
                </button>
                <button
                  type="button"
                  className="admin-danger-button"
                  onClick={() => removeItem(item.id)}
                >
                  Șterge fișier
                </button>
              </div>
            </div>
          ))}
        </div>

        {!filteredItems.length ? (
          <p className="admin-helper-text">
            Nu există fișiere în filtrul selectat.
          </p>
        ) : null}
      </div>
    </div>
  );
}