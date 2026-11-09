import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductsView } from "@/components/product/ProductsView";
import { PageHeader } from "@/components/ui/PageHeader";
import { CatalogSkeleton } from "@/components/ui/PageSkeletons";

export const metadata: Metadata = { title: "All products" };

// useSearchParams is request-time data, so this has to stream behind Suspense.
export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <>
          <PageHeader
            title="All Products"
            subtitle="Explore our complete product collection"
            crumbs={[{ label: "All Products" }]}
            icon="package-search"
          />
          <div className="container-page py-8">
            <CatalogSkeleton count={12} />
          </div>
        </>
      }
    >
      <ProductsView />
    </Suspense>
  );
}
