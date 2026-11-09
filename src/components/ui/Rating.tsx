import { Icon } from "@/components/ui/icons";

export function Stars({
  value,
  size = 14,
  className = "text-amber-400",
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((i) =>
        i <= full ? (
          <Icon name="star" key={i} size={size} filled />
        ) : i === full + 1 && half ? (
          <Icon name="star-half" key={i} size={size} />
        ) : (
          <Icon name="star" key={i} size={size} />
        ),
      )}
    </div>
  );
}
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  size = 14,
  className,
}: {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Stars value={value} size={size} />
      <span className="text-xs font-medium text-muted">
        {value.toFixed(1)}
        {count !== undefined && ` (${count})`}
      </span>
    </div>
  );
}

export function RatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={value === i}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
          onClick={() => onChange(i)}
          className="transition hover:scale-110"
        >
          <Icon
            name="star"
            size={26}
            filled={i <= value}
            className={i <= value ? "text-amber-400" : "text-line-strong"}
          />
        </button>
      ))}
    </div>
  );
}
