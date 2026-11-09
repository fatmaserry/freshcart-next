"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Icon, type IconRef } from "@/components/ui/icons";
import { useBrand, useCategory, useSubCategory } from "@/hooks/useCatalog";
import { PageHeader, type Crumb } from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";
import { ProductCatalog } from "./ProductCatalog";

interface ActiveFilter {
  name: string;
  subtitle: string;
  parent: Crumb;
  chipIcon: IconRef;
  chipClass: string;
  image?: string;
}

function ActiveFilters({ filter }: { filter: ActiveFilter }) {
  const icon = filter.chipIcon;
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-2 text-sm text-body">
        <Icon name="filter" size={18.8} /> Active Filters:
      </span>
      <Link
        href="/products"
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
          filter.chipClass,
        )}
      >
        <Icon name={icon} size={14} />
        {filter.name}
        <Icon name="x" size={14} />
      </Link>
      <Link
        href="/products"
        className="text-sm text-muted underline hover:text-body"
      >
        Clear all
      </Link>
    </div>
  );
}

export function ProductsView() {
  const params = useSearchParams();
  const subcategory = useSubCategory(params.get("subcategory"));
  const category = useCategory(params.get("category") ?? "");
  const brand = useBrand(params.get("brand") ?? "");
  const categories = { label: "Categories", href: "/categories" };

  let filter: ActiveFilter | undefined;
  if (subcategory.data) {
    const { name } = subcategory.data;
    filter = {
      name,
      subtitle: `Browse ${name} products`,
      parent: categories,
      chipIcon: "folder-open",
      chipClass: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    };
  } else if (category.data) {
    const { name, image } = category.data;
    filter = {
      name,
      image,
      subtitle: `Browse products in ${name}`,
      parent: categories,
      chipIcon: "layers",
      chipClass: "bg-brand-100 text-brand-700 hover:bg-brand-200",
    };
  } else if (brand.data) {
    const { name, image } = brand.data;
    filter = {
      name,
      image,
      subtitle: `Shop ${name} products`,
      parent: { label: "Brands", href: "/brands" },
      chipIcon: "tags",
      chipClass: "bg-violet-100 text-violet-700 hover:bg-violet-200",
    };
  }

  return (
    <>
      {filter && <title>{`${filter.name} · FreshCart`}</title>}
      <PageHeader
        title={filter?.name ?? "All Products"}
        subtitle={filter?.subtitle ?? "Explore our complete product collection"}
        crumbs={
          filter
            ? [filter.parent, { label: filter.name }]
            : [{ label: "All Products" }]
        }
        icon={filter ? "folder-open" : "package-search"}
        media={
          filter?.image && (
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-xl ring-1 ring-white/30 backdrop-blur-sm">
              <span className="relative h-10 w-10">
                <Image
                  src={filter.image}
                  alt={filter.name}
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </span>
            </span>
          )
        }
      />
      <div className="container-page py-8">
        <ProductCatalog header={filter && <ActiveFilters filter={filter} />} />
      </div>
    </>
  );
}
