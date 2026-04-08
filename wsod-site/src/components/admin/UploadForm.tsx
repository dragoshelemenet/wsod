"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { homeCategories } from "@/lib/data/home-data";

interface UploadFormProps {
  selectedBrand: string;
}

export default function UploadForm({ selectedBrand }: UploadFormProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const uploadUnlocked = useMemo(() => {
    return Boolean(selectedBrand && selectedCategory);
  }, [selectedBrand, selectedCategory]);

  function handleFilesChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setSelectedFiles(files);
  }

  return (
    <div className="admin-panel-card">
      <div className="admin-card-head">
        <h2>2. Categorie + upload</h2>
      </div>

      <div className="admin-stack">
        <div className="admin-form-field">
          <label htmlFor="category">Categorie</label>
          <select
            id="category"
            className="admin-select"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="">Selectează categoria</option>
            {homeCategories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-summary-box">
          <p>
            <strong>Brand selectat:</strong> {selectedBrand || "Neselectat"}
          </p>
          <p>
            <strong>Categorie selectată:</strong> {selectedCategory || "Neselectată"}
          </p>
        </div>

        {!uploadUnlocked ? (
          <p className="admin-helper-text">
            Upload-ul se activează doar după ce alegi un brand și o categorie.
          </p>
        ) : (
          <>
            <div className="admin-upload-box">
              <label htmlFor="file-upload" className="admin-upload-label">
                Alege fișiere
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFilesChange}
              />
            </div>

            <div className="admin-files-preview">
              {selectedFiles.length ? (
                selectedFiles.map((file) => (
                  <div key={`${file.name}-${file.size}`} className="admin-file-chip">
                    {file.name}
                  </div>
                ))
              ) : (
                <p className="admin-helper-text">
                  Încă nu ai selectat fișiere pentru upload.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}