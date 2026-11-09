import type { Metadata } from "next";
import { CategoriesView } from "@/components/catalog/CategoriesView";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Categories" };

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-surface-alt/50">
      <PageHeader
        title="All Categories"
        subtitle="Browse our wide range of product categories"
        crumbs={[{ label: "Categories" }]}
        icon="layers"
        padding="py-12 sm:py-16"
      />
      <div className="container-page py-10">
        <CategoriesView />
      </div>
    </div>
  );
}
