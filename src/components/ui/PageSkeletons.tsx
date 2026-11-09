import { Skeleton } from "./Skeleton";
import { ProductCardSkeleton } from "@/components/product/ProductCard";

export function CatalogSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading products">
      <div className="mb-5 flex items-center justify-between gap-3">
        <Skeleton className="h-5 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading product">
      <div className="border-b border-line-soft bg-surface-card">
        <div className="container-page py-4">
          <Skeleton className="h-5 w-72" />
        </div>
      </div>
      <div className="container-page grid gap-6 py-8 lg:grid-cols-[1fr_3fr]">
        <div className="rounded-xl border border-line-soft bg-surface-card p-4">
          <Skeleton className="aspect-square" />
          <div className="mt-4 flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-20" />
            ))}
          </div>
        </div>
        <div className="space-y-4 rounded-xl border border-line-soft bg-surface-card p-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-24" />
          <Skeleton className="h-14" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-13" />
            <Skeleton className="h-13" />
          </div>
        </div>
      </div>
    </div>
  );
}

const tones = {
  green: "from-brand-600 via-brand-500 to-brand-400",
  purple: "from-(--fc-violet-600) via-violet-500 to-purple-400",
};

export function DetailsPageSkeleton({
  tone = "green",
}: {
  tone?: keyof typeof tones;
}) {
  return (
    <>
      <div className={`bg-linear-to-r ${tones[tone]}`}>
        <div className="container-page space-y-4 pb-14 pt-16">
          <Skeleton className="h-5 w-48 bg-white/30" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-2xl bg-white/40" />
            <div className="space-y-2">
              <Skeleton className="h-9 w-56 bg-white/40" />
              <Skeleton className="h-5 w-40 bg-white/30" />
            </div>
          </div>
        </div>
      </div>
      <div className="container-page py-8">
        <CatalogSkeleton />
      </div>
    </>
  );
}
