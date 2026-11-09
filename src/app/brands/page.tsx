import type { Metadata } from "next";
import { BrandsView } from "@/components/catalog/BrandsView";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Brands" };

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-surface-alt/50">
      <PageHeader
        title="Top Brands"
        subtitle="Shop from your favorite brands"
        crumbs={[{ label: "Brands" }]}
        icon="tags"
        tone="purple"
        padding="py-12 sm:py-16"
      />
      <div className="container-page py-10">
        <BrandsView />
      </div>
    </div>
  );
}
