type PublicCardProps = {
  title: string;
  subtitle?: string;
};

export function PublicCard({ title, subtitle }: PublicCardProps) {
  return (
    <article className="public-card">
      <div className="public-card-media" />
      <div className="public-card-copy">
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </article>
  );
}
