"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { useCategories } from "@/hooks/useCatalog";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/EmptyState";
import { getErrorMessage } from "@/lib/utils";

export function CategoriesView() {
  const { data, isLoading, error, refetch } = useCategories();
  if (error)
    return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
      {isLoading
        ? Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))
        : data?.data.map((c) => (
            <Link
              key={c._id}
              href={`/categories/${c._id}`}
              className="group rounded-2xl border border-line-soft bg-surface-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl sm:p-6"
            >
              <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-surface-media">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="text-center font-bold text-heading transition-colors group-hover:text-brand-600">
                {c.name}
              </h3>
              <div className="mt-2 flex justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <span className="flex items-center gap-1 text-xs text-brand-600">
                  View Subcategories <Icon name="arrow-right" size={12} />
                </span>
              </div>
            </Link>
          ))}
    </div>
  );
}
