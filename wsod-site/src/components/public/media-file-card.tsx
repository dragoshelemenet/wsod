type MediaFileCardProps = {
  title: string;
  category: string;
};

export function MediaFileCard({ title, category }: MediaFileCardProps) {
  return (
    <article className="media-file-card">
      <div className="media-file-card-thumb" />
      <div className="media-file-card-meta">
        <strong>{title}</strong>
        <span>{category}</span>
      </div>
    </article>
  );
}
