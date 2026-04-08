import MediaCard from "@/components/media/MediaCard";
import { DbMediaCardItem } from "@/lib/types";

interface MediaGridProps {
  items: DbMediaCardItem[];
  emptyText: string;
}

export default function MediaGrid({ items, emptyText }: MediaGridProps) {
  if (!items.length) {
    return <p className="empty-state">{emptyText}</p>;
  }

  return (
    <div className="media-grid">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
}