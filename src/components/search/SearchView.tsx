"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/icons";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterPanel } from "./FilterPanel";
import {
  applyFilters,
  EMPTY,
  fromUrl,
  toggled,
  toUrl,
  type Filters,
} from "./searchFilters";
import { ErrorState } from "@/components/ui/EmptyState";
import {
  useBrands,
  useCategories,
  useProductSearchPool,
} from "@/hooks/useCatalog";
import { cn, getErrorMessage } from "@/lib/utils";

const PAGE_SIZE = 12;
const BRANDS_SHOWN = 15;

const sortOptions = [
  { value: "", label: "Relevance" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "-ratingsAverage", label: "Rating: High to Low" },
  { value: "title", label: "Name: A to Z" },
  { value: "-title", label: "Name: Z to A" },
];

function Chip({
  className,
  onRemove,
  children,
}: {
  className: string;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs",
        className,
      )}
    >
      {children}
      <button
        onClick={onRemove}
        aria-label="Remove filter"
        className="hover:text-red-500"
      >
        <Icon name="x" size={14} />
      </button>
    </span>
  );
}

export function SearchView() {
  const params = useSearchParams();
  const pool = useProductSearchPool();
  const categories = useCategories();
  const brands = useBrands(1, 100);
  const [filters, setFilters] = useState(() => fromUrl(params));
  const [view, setView] = useState<"grid" | "list">("grid");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // The header can change the URL while this page stays mounted.
  const url = params.toString();
  const [lastUrl, setLastUrl] = useState(url);
  if (url !== lastUrl) {
    setLastUrl(url);
    if (url !== toUrl(filters)) setFilters(fromUrl(params));
  }

  const apply = (next: Filters) => {
    setFilters(next);
    const query = toUrl(next);
    window.history.replaceState(
      null,
      "",
      query ? `/search?${query}` : "/search",
    );
  };
  const update = (patch: Partial<Filters>) =>
    apply({ ...filters, page: 1, ...patch });
  const clearAll = () => apply(EMPTY);

  const results = useMemo(
    () => applyFilters(pool.data?.data ?? [], filters),
    [pool.data, filters],
  );
  const totalPages = Math.ceil(results.length / PAGE_SIZE);
  const page = Math.min(filters.page, Math.max(totalPages, 1));
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (p: number) => {
    apply({ ...filters, page: p });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasPrice = !!(filters.min || filters.max);
  const hasFilters =
    filters.categories.length > 0 || filters.brands.length > 0 || hasPrice;
  const q = filters.q.trim();
  const categoryName = (id: string) =>
    categories.data?.data.find((c) => c._id === id)?.name ?? "Category";
  const brandName = (id: string) =>
    brands.data?.data.find((b) => b._id === id)?.name ?? "Brand";

  const filterPanel = (
    <FilterPanel
      filters={filters}
      categories={categories.data?.data ?? []}
      brands={brands.data?.data.slice(0, BRANDS_SHOWN) ?? []}
      canClear={!!q || hasFilters}
      onChange={update}
      onClear={clearAll}
    />
  );

  return (
    <div className="min-h-screen bg-surface-alt/50">
      <div className="border-b border-line-soft bg-surface-card">
        <div className="container-page py-6">
          <nav className="mb-4 flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="transition-colors hover:text-brand-600">
              Home
            </Link>
            <span className="text-line-strong">/</span>
            <span className="font-medium text-heading">Search Results</span>
          </nav>
          <form onSubmit={(e) => e.preventDefault()} className="max-w-2xl">
            <div className="relative">
              <Icon
                name="search"
                size={18.8}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-hint"
              />
              <input
                type="text"
                value={filters.q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="Search for products..."
                aria-label="Search for products"
                className="w-full rounded-xl border border-line-strong bg-surface-card py-3 pl-12 pr-4 text-lg outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </form>
          {q && (
            <div className="mt-4">
              <h1 className="text-2xl font-bold text-heading">
                Search Results for &quot;{q}&quot;
              </h1>
              <p className="mt-1 text-sm text-muted">
                We found {results.length} products for you
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="container-page py-8">
        <div className="flex gap-8">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-line-soft bg-surface-card p-6">
              {filterPanel}
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-line-strong bg-surface-card px-4 py-2 text-sm font-medium text-body hover:bg-surface-alt lg:hidden"
                >
                  <Icon name="sliders-horizontal" size={18.8} /> Filters
                </button>
                <div className="flex items-center gap-1 rounded-lg border border-line-strong bg-surface-card p-1">
                  {(
                    [
                      { id: "grid", icon: "grip-vertical" },
                      { id: "list", icon: "list" },
                    ] as const
                  ).map(({ id, icon }) => (
                    <button
                      key={id}
                      onClick={() => setView(id)}
                      aria-label={`${id} view`}
                      className={cn(
                        "rounded-md p-2 transition-colors",
                        view === id
                          ? "bg-brand-600 text-white"
                          : "text-muted hover:text-body",
                      )}
                    >
                      <Icon name={icon} size={18.8} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted">Sort by:</span>
                <div className="relative">
                  <select
                    value={filters.sort}
                    onChange={(e) => update({ sort: e.target.value })}
                    aria-label="Sort by"
                    className="appearance-none rounded-lg border border-line-strong bg-surface-card px-3 py-2 pr-9 text-sm text-body outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  >
                    {sortOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <Icon
                    name="chevron-down"
                    size={12}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                </div>
              </div>
            </div>

            {(q || hasFilters) && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-sm text-muted">
                  <Icon name="filter" size={14} /> Active:
                </span>
                {q && (
                  <Chip
                    className="bg-surface-muted text-body"
                    onRemove={() => update({ q: "" })}
                  >
                    &quot;{q}&quot;
                  </Chip>
                )}
                {filters.categories.map((id) => (
                  <Chip
                    key={id}
                    className="bg-brand-100 text-brand-700"
                    onRemove={() =>
                      update({ categories: toggled(filters.categories, id) })
                    }
                  >
                    {categoryName(id)}
                  </Chip>
                ))}
                {filters.brands.map((id) => (
                  <Chip
                    key={id}
                    className="bg-violet-100 text-violet-700"
                    onRemove={() =>
                      update({ brands: toggled(filters.brands, id) })
                    }
                  >
                    {brandName(id)}
                  </Chip>
                ))}
                {hasPrice && (
                  <Chip
                    className="bg-amber-100 text-amber-700"
                    onRemove={() => update({ min: "", max: "" })}
                  >
                    {filters.min || 0} - {filters.max || "∞"} EGP
                  </Chip>
                )}
                <button
                  onClick={clearAll}
                  className="ml-2 text-xs text-muted underline hover:text-body"
                >
                  Clear all
                </button>
              </div>
            )}

            {pool.error ? (
              <ErrorState
                message={getErrorMessage(pool.error)}
                onRetry={() => pool.refetch()}
              />
            ) : pool.isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Icon
                    name="spinner"
                    size={42}
                    className="mb-4 animate-spin text-brand-600"
                  />
                  <p className="text-muted">Searching products...</p>
                </div>
              </div>
            ) : visible.length > 0 ? (
              <>
                <div
                  className={
                    view === "grid"
                      ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                      : "space-y-4"
                  }
                >
                  {visible.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1}
                      aria-label="Previous page"
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-line-strong text-body transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Icon name="chevron-left" size={18.8} />
                    </button>
                    {Array.from(
                      { length: Math.min(5, totalPages) },
                      (_, i) => i + 1,
                    ).map((p) => (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg font-medium transition-colors",
                          page === p
                            ? "bg-brand-600 text-white"
                            : "border border-line-strong text-body hover:bg-surface-alt",
                        )}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => goToPage(page + 1)}
                      disabled={page === totalPages}
                      aria-label="Next page"
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-line-strong text-body transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Icon name="chevron-right" size={18.8} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-surface-muted">
                  <Icon name="search" size={35} className="text-hint" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-heading">
                  No Products Found
                </h3>
                <p className="mb-6 text-muted">
                  Try adjusting your search or filters to find what you&apos;re
                  looking for.
                </p>
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute bottom-0 right-0 top-0 w-80 overflow-y-auto bg-surface-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted"
              >
                <Icon name="x" size={18.8} />
              </button>
            </div>
            {filterPanel}
          </div>
        </div>
      )}
    </div>
  );
}
