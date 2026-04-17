"use client";

import { useState } from "react";
import { DashboardTalentForm } from "@/components/dashboard/dashboard-talent-form";

type TalentKind = "artist" | "influencer";

type TalentItem = {
  id: string;
  name: string;
  slug: string;
  kind: TalentKind;
  portraitImageUrl?: string | null;
  coverImageUrl?: string | null;
  description?: string | null;
  isVisible?: boolean;
};

export function DashboardTalentList({
  kind,
  items,
}: {
  kind: TalentKind;
  items: TalentItem[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const label = kind === "artist" ? "artist" : "influencer";

  return (
    <div className="admin-list compact-admin-list">
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <article key={item.id} className="admin-list-item">
            <div className="admin-card-head">
              <div>
                <h3>{item.name}</h3>
                <p className="admin-helper-text">{item.slug}</p>
              </div>

              <button
                className="admin-secondary-button"
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                {isOpen ? "Close" : "Edit"}
              </button>
            </div>

            {isOpen ? (
              <DashboardTalentForm
                kind={kind}
                mode="edit"
                item={item}
                onDone={() => setOpenId(null)}
              />
            ) : null}
          </article>
        );
      })}

      {!items.length ? (
        <div className="empty-state-block">
          <h3>No {label}s yet</h3>
          <p>Nu există încă {label}i creați.</p>
        </div>
      ) : null}
    </div>
  );
}
