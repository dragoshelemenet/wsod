"use client";

import { useState } from "react";

type DashboardDeleteButtonProps = {
  endpoint: string;
  label: string;
};

export function DashboardDeleteButton({
  endpoint,
  label,
}: DashboardDeleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onDelete() {
    const confirmed = window.confirm(`Sigur vrei sa stergi ${label}?`);
    if (!confirmed) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Nu s-a putut sterge itemul.");
      }

      setMessage("Sters cu succes. Da refresh paginii.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Eroare necunoscuta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-stack">
      <button
        type="button"
        className="admin-danger-button"
        onClick={onDelete}
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete"}
      </button>

      {message ? <p className="admin-helper-text">{message}</p> : null}
    </div>
  );
}
