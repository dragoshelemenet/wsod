"use client";

import { createMediaAction } from "@/app/actions/admin-actions";

interface CreateMediaFormProps {
  brands: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export default function CreateMediaForm({ brands }: CreateMediaFormProps) {
  return (
    <div className="admin-panel-card">
      <div className="admin-card-head">
        <h2>2. Creează fișier nou</h2>
      </div>

      <form action={createMediaAction} className="admin-stack">
        <div className="admin-form-field">
          <label htmlFor="brandSlug">Brand</label>
          <select id="brandSlug" name="brandSlug" className="admin-select" required>
            <option value="">Selectează brandul</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form-field">
          <label htmlFor="category">Categorie</label>
          <select id="category" name="category" className="admin-select" required>
            <option value="">Selectează categoria</option>
            <option value="video">VIDEO</option>
            <option value="foto">PHOTO</option>
            <option value="grafica">GRAPHIC</option>
            <option value="website">WEBSITE</option>
            <option value="meta-ads">META ADS</option>
            <option value="audio">AUDIO</option>
          </select>
        </div>

        <div className="admin-form-field">
          <label htmlFor="type">Tip</label>
          <select id="type" name="type" className="admin-select" required>
            <option value="">Selectează tipul</option>
            <option value="video">video</option>
            <option value="image">image</option>
            <option value="audio">audio</option>
            <option value="website">website</option>
            <option value="graphic">graphic</option>
          </select>
        </div>

        <div className="admin-form-field">
          <label htmlFor="title">Titlu</label>
          <input id="title" name="title" type="text" required />
        </div>

        <div className="admin-form-field">
          <label htmlFor="description">Descriere</label>
          <input id="description" name="description" type="text" />
        </div>

        <div className="admin-form-field">
          <label htmlFor="date">Dată</label>
          <input id="date" name="date" type="date" required />
        </div>

        <div className="admin-form-field">
          <label htmlFor="fileUrl">File URL</label>
          <input
            id="fileUrl"
            name="fileUrl"
            type="text"
            placeholder="/media/demo/coca-cola/test-photo.jpg"
          />
        </div>

        <div className="admin-form-field">
          <label htmlFor="thumbnail">Thumbnail URL</label>
          <input
            id="thumbnail"
            name="thumbnail"
            type="text"
            placeholder="/media/demo/coca-cola/test-photo.jpg"
          />
        </div>

        <button type="submit" className="admin-submit">
          Creează fișier
        </button>
      </form>
    </div>
  );
}
