import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import type { Product } from "@/types/api";

export function ProductBreadcrumb({ product }: { product: Product }) {
  const sub = product.subcategory[0];
  const crumb =
    "flex items-center gap-1.5 text-muted transition hover:text-brand-600";
  const separator = (
    <Icon name="chevron-right" size={14} className="mx-2 text-hint" />
  );

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <div className="container-page">
        <ol className="flex flex-wrap items-center gap-1 text-sm">
          <li className="flex items-center">
            <Link href="/" className={crumb}>
              <Icon name="home" size={14} /> Home
            </Link>
            {separator}
          </li>
          <li className="flex items-center">
            <Link
              href={`/categories/${product.category._id}`}
              className={crumb}
            >
              {product.category.name}
            </Link>
            {separator}
          </li>
          {sub && (
            <li className="flex items-center">
              <Link href={`/products?subcategory=${sub._id}`} className={crumb}>
                {sub.name}
              </Link>
              {separator}
            </li>
          )}
          <li className="max-w-xs truncate font-medium text-heading">
            {product.title}
          </li>
        </ol>
      </div>
    </nav>
  );
}
