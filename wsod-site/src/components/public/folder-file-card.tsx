type FolderFileCardProps = {
  title: string;
  kind: "brand" | "model";
};

export function FolderFileCard({ title, kind }: FolderFileCardProps) {
  return (
    <article className="owner-folder-card">
      <div className="owner-folder-classic-body">
        <div className="folder-brand-art-wrap">
          <div className="media-file-card-thumb" />
        </div>
      </div>
      <div className="media-file-card-meta">
        <strong>{title}</strong>
        <span>{kind}</span>
      </div>
    </article>
  );
}
