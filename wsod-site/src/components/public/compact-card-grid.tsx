type CompactCard = {
  id: string;
  title: string;
  meta?: string;
};

export function CompactCardGrid({
  items,
}: {
  items: CompactCard[];
}) {
  return (
    <div className="compact-grid">
      {items.map((item) => (
        <article key={item.id} className="compact-card">
          <div className="compact-card-media" />
          <div className="compact-card-footer">
            <h2>{item.title}</h2>
            {item.meta ? <p>{item.meta}</p> : null}
          </div>
        </article>
      ))}
    </div>
  );
}
