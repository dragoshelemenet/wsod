import MediaCard from "@/components/media/MediaCard";
import { MediaItem } from "@/lib/types";

interface MediaGridProps {
  items: MediaItem[];
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