"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { useBrands } from "@/hooks/useCatalog";
import { ErrorState } from "@/components/ui/EmptyState";
import { getErrorMessage } from "@/lib/utils";

export function BrandsView() {
  const { data, isLoading, error, refetch } = useBrands(1, 100);
  const brands = data?.data ?? [];

  if (error)
    return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Icon
            name="spinner"
            size={42}
            className="mb-4 animate-spin text-violet-600"
          />
          <p className="text-muted">Loading brands...</p>
        </div>
      </div>
    );
  }
  if (brands.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-surface-muted">
          <Icon name="tags" size={35} className="text-hint" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-heading">No Brands Found</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-6">
      {brands.map((b) => (
        <Link
          key={b._id}
          href={`/products?brand=${b._id}`}
          className="group rounded-2xl border border-line-soft bg-surface-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl sm:p-5"
        >
          <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-surface-alt">
            <Image
              src={b.image}
              alt={b.name}
              fill
              sizes="200px"
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <h3 className="truncate text-center text-sm font-semibold text-heading transition-colors group-hover:text-violet-600">
            {b.name}
          </h3>
          <div className="mt-1.5 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
            <span className="flex items-center gap-1 text-xs text-violet-600">
              View Products <Icon name="arrow-right" size={12} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
