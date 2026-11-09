"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/Spinner";
import { useProductSearchPool } from "@/hooks/useCatalog";
import { cn, formatPrice } from "@/lib/utils";
import { matchesSearch } from "@/lib/productSearch";

const MAX_SUGGESTIONS = 6;

export function SearchBox({
  className,
  inputClassName,
  buttonClassName,
  placeholder,
  onNavigate,
}: {
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  placeholder: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const needle = term.trim();
  const pool = useProductSearchPool(needle.length > 0);

  const suggestions = useMemo(
    () =>
      needle
        ? (pool.data?.data ?? [])
            .filter((p) => matchesSearch(p, needle))
            .slice(0, MAX_SUGGESTIONS)
        : [],
    [pool.data, needle],
  );

  const finish = () => {
    setTerm("");
    setOpen(false);
    setHighlighted(-1);
    onNavigate?.();
  };

  const resultsHref = `/search?q=${encodeURIComponent(needle)}`;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!needle) return;
    const picked = suggestions[highlighted];
    router.push(picked ? `/products/${picked._id}` : resultsHref);
    finish();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const step = e.key === "ArrowDown" ? 1 : -1;
    // One extra slot represents "nothing highlighted".
    const slots = suggestions.length + 1;
    setHighlighted((h) => ((h + 1 + step + slots) % slots) - 1);
  };

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="relative w-full">
        <input
          type="text"
          value={term}
          autoComplete="off"
          aria-label="Search products"
          placeholder={placeholder}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
            setHighlighted(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className={cn(
            "w-full border border-line-strong py-3 pr-12 text-sm transition-all focus:border-brand-500 focus:bg-surface-card focus:outline-none focus:ring-2 focus:ring-brand-500/20",
            inputClassName,
          )}
        />
        <button
          type="submit"
          aria-label="Search"
          className={cn(
            "absolute top-1/2 flex -translate-y-1/2 items-center justify-center bg-brand-600 text-white transition-colors hover:bg-brand-700",
            buttonClassName,
          )}
        >
          <Icon name="search" size={16.5} />
        </button>

        {open && needle && (
          // Keeps focus in the input so blur doesn't close the list before the click lands.
          <div
            onMouseDown={(e) => e.preventDefault()}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line-soft bg-surface-card shadow-xl"
          >
            {pool.isLoading ? (
              <div className="flex items-center justify-center gap-2 p-5 text-sm text-muted">
                <Spinner className="h-4 w-4" /> Searching products...
              </div>
            ) : suggestions.length === 0 ? (
              <p className="p-5 text-center text-sm text-muted">
                No products found for &ldquo;{needle}&rdquo;
              </p>
            ) : (
              <>
                <ul className="py-1">
                  {suggestions.map((p, i) => (
                    <li key={p._id}>
                      <Link
                        href={`/products/${p._id}`}
                        prefetch={false}
                        onClick={finish}
                        onMouseEnter={() => setHighlighted(i)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 transition-colors",
                          i === highlighted && "bg-brand-50",
                        )}
                      >
                        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-surface-media">
                          <Image
                            src={p.imageCover}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-contain p-0.5"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-heading">
                            {p.title}
                          </span>
                          <span className="block truncate text-xs text-muted">
                            {p.category?.name}
                          </span>
                        </span>
                        <span className="shrink-0 text-sm font-bold text-brand-600">
                          {formatPrice(p.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={resultsHref}
                  prefetch={false}
                  onClick={finish}
                  className="flex items-center justify-center gap-2 border-t border-line-soft bg-surface-alt px-4 py-3 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50"
                >
                  See all results for &ldquo;{needle}&rdquo;
                  <Icon name="arrow-right" size={13} />
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
