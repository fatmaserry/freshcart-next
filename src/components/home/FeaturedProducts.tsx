"use client";

import { useProducts } from "@/hooks/useCatalog";
import { ProductGrid } from "@/components/product/ProductCard";
import { SectionHeading, SectionLink } from "@/components/ui/PageHeader";

export function FeaturedProducts() {
  const { data, isLoading } = useProducts({ limit: 40 });
  return (
    <section className="container-page pb-16 pt-18">
      <div className="px-4">
        <SectionHeading
          title="Featured"
          highlight="Products"
          action={<SectionLink href="/products">View All Products</SectionLink>}
        />
        <ProductGrid products={data?.data} loading={isLoading} skeletons={10} />
      </div>
    </section>
  );
}
