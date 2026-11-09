"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icons";
import { useProducts } from "@/hooks/useCatalog";
import { ProductGrid } from "./ProductCard";
import { Pagination } from "@/components/ui/Pagination";
import { ErrorState } from "@/components/ui/EmptyState";
import { cn, getErrorMessage, parsePage } from "@/lib/utils";
import type { ProductQuery, ProductSort } from "@/types/api";

const PAGE_SIZE = 12;

export function ProductCatalog({ header }: { header?: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const page = parsePage(params.get("page"));
  const query: ProductQuery = {
    sort: (params.get("sort") as ProductSort) || undefined,
    brand: params.get("brand") || undefined,
    category: params.get("category") || undefined,
    subcategory: params.get("subcategory") || undefined,
  };

  const { data, error, isLoading, isFetching, refetch } = useProducts({
    ...query,
    page,
    limit: PAGE_SIZE,
  });
  const products = data?.data;

  const goToPage = (p: number) => {
    const next = new URLSearchParams(params.toString());
    next.set("page", String(p));
    router.replace(`${pathname}?${next}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {header}
      <div className="mb-6 text-sm text-muted">
        {isLoading ? "Loading…" : `Showing ${data?.results ?? 0} products`}
      </div>

      {error ? (
        <ErrorState
          message={getErrorMessage(error)}
          onRetry={() => refetch()}
        />
      ) : !isLoading && !products?.length ? (
        <div className="py-20 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-surface-muted">
            <Icon name="package-search" size={35} className="text-hint" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-heading">
            No Products Found
          </h3>
          <p className="mb-6 text-muted">
            No products match your current filters.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
          >
            View All Products
          </Link>
        </div>
      ) : (
        <div
          className={cn(
            "transition-opacity",
            isFetching && !isLoading && "opacity-60",
          )}
        >
          <ProductGrid
            priorityCount={5}
            products={products}
            loading={isLoading}
            skeletons={PAGE_SIZE}
            className="grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5"
          />
        </div>
      )}

      <Pagination
        page={page}
        totalPages={data?.metadata.numberOfPages ?? 1}
        onChange={goToPage}
      />
    </div>
  );
}
