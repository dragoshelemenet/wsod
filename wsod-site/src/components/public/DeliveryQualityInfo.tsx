type DeliveryQualityInfoProps = {
  className?: string;
};

const MESSAGE =
  "Materialele finale au fost livrate clientului în format mare, la calitate înaltă. Pe website sunt afișate variante optimizate, pentru o încărcare mai rapidă.";

export function DeliveryQualityInfo({ className = "" }: DeliveryQualityInfoProps) {
  return (
    <div className={`delivery-quality-note ${className}`.trim()}>
      <button
        type="button"
        className="delivery-quality-note-trigger"
        aria-label="Informații despre calitatea materialelor"
      >
        i
      </button>
      <div className="delivery-quality-note-tooltip">
        {MESSAGE}
      </div>
    </div>
  );
}
