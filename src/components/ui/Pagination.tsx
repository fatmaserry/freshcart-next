import { Icon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-1.5"
      aria-label="Pagination"
    >
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-line-soft bg-surface-card disabled:opacity-40"
        aria-label="Previous page"
      >
        <Icon name="chevron-left" size={18} />
      </button>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-1.5">
          {i > 0 && p - pages[i - 1] > 1 && (
            <span className="px-1 text-hint">…</span>
          )}
          <button
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition",
              p === page
                ? "bg-brand-600 text-white"
                : "border border-line-soft bg-surface-card hover:border-brand-500",
            )}
          >
            {p}
          </button>
        </span>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-line-soft bg-surface-card disabled:opacity-40"
        aria-label="Next page"
      >
        <Icon name="chevron-right" size={18} />
      </button>
    </nav>
  );
}
