"use client";

import { useState } from "react";

type ToggleItem = {
  id: string;
  name?: string;
  label?: string;
  key?: string;
  isVisible: boolean;
};

interface Props {
  sections: { id: string; key: string; label: string; isVisible: boolean }[];
  brands: { id: string; name: string; isVisible: boolean }[];
  models: { id: string; name: string; isVisible: boolean }[];
  audioProfiles: { id: string; name: string; kind: string; isVisible: boolean }[];
}

async function updateVisibility(entityType: string, id: string, isVisible: boolean) {
  const response = await fetch("/api/admin/visibility", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entityType, id, isVisible }),
  });

  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(result.message || "Nu s-a putut salva.");
  }
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="admin-toggle-row">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

export default function VisibilityManager({
  sections,
  brands,
  models,
  audioProfiles,
}: Props) {
  const [message, setMessage] = useState("");

  const [sectionItems, setSectionItems] = useState(sections);
  const [brandItems, setBrandItems] = useState(brands);
  const [modelItems, setModelItems] = useState(models);
  const [audioItems, setAudioItems] = useState(audioProfiles);

  async function handleToggle(
    entityType: "section" | "brand" | "model" | "audioProfile",
    id: string,
    checked: boolean
  ) {
    setMessage("");

    try {
      await updateVisibility(entityType, id, checked);

      if (entityType === "section") {
        setSectionItems((current) =>
          current.map((item) => (item.id === id ? { ...item, isVisible: checked } : item))
        );
      }

      if (entityType === "brand") {
        setBrandItems((current) =>
          current.map((item) => (item.id === id ? { ...item, isVisible: checked } : item))
        );
      }

      if (entityType === "model") {
        setModelItems((current) =>
          current.map((item) => (item.id === id ? { ...item, isVisible: checked } : item))
        );
      }

      if (entityType === "audioProfile") {
        setAudioItems((current) =>
          current.map((item) => (item.id === id ? { ...item, isVisible: checked } : item))
        );
      }

      setMessage("Visibility actualizat.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscută.");
    }
  }

  return (
    <div className="admin-grid">
      <div className="admin-panel-card">
        <div className="admin-card-head">
          <h2>Secțiuni site</h2>
        </div>

        <div className="admin-stack">
          {sectionItems.map((item) => (
            <ToggleRow
              key={item.id}
              label={item.label}
              checked={item.isVisible}
              onChange={(checked) => handleToggle("section", item.id, checked)}
            />
          ))}
        </div>
      </div>

      <div className="admin-panel-card">
        <div className="admin-card-head">
          <h2>Branduri</h2>
        </div>

        <div className="admin-stack">
          {brandItems.map((item) => (
            <ToggleRow
              key={item.id}
              label={item.name}
              checked={item.isVisible}
              onChange={(checked) => handleToggle("brand", item.id, checked)}
            />
          ))}
        </div>
      </div>

      <div className="admin-panel-card">
        <div className="admin-card-head">
          <h2>Modele</h2>
        </div>

        <div className="admin-stack">
          {modelItems.map((item) => (
            <ToggleRow
              key={item.id}
              label={item.name}
              checked={item.isVisible}
              onChange={(checked) => handleToggle("model", item.id, checked)}
            />
          ))}
        </div>
      </div>

      <div className="admin-panel-card">
        <div className="admin-card-head">
          <h2>Profiluri audio</h2>
        </div>

        <div className="admin-stack">
          {audioItems.map((item) => (
            <ToggleRow
              key={item.id}
              label={`${item.name} (${item.kind})`}
              checked={item.isVisible}
              onChange={(checked) => handleToggle("audioProfile", item.id, checked)}
            />
          ))}
        </div>
      </div>

      {message ? (
        <div className="admin-panel-card">
          <p className="admin-success">{message}</p>
        </div>
      ) : null}
    </div>
  );
}