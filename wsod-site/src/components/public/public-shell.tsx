import type { ReactNode } from "react";

type PublicShellProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PublicShell({
  title,
  description,
  children,
}: PublicShellProps) {
  return (
    <main className="inner-page">
      <section className="inner-section public-shell">
        <div className="public-shell-head">
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
        </div>
        {children}
      </section>
    </main>
  );
}
