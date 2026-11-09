"use client";

import { useRef } from "react";
import { Icon } from "@/components/ui/icons";
import { useProducts } from "@/hooks/useCatalog";
import { SectionHeading } from "@/components/ui/PageHeader";
import type { Product } from "@/types/api";
import { ProductCard } from "./ProductCard";

export function RelatedProducts({ product }: { product: Product }) {
  const scroller = useRef<HTMLDivElement>(null);
  const { data } = useProducts({ category: product.category._id, limit: 11 });
  const related =
    data?.data.filter((p) => p._id !== product._id).slice(0, 10) ?? [];
  if (!related.length) return null;

  const scroll = (direction: number) =>
    scroller.current?.scrollBy({
      left: direction * scroller.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  const arrow =
    "flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-body transition hover:bg-brand-100 hover:text-brand-600";

  return (
    <section id="similar-products" className="py-10">
      <div className="container-page">
        <SectionHeading
          title="You May Also"
          highlight="Like"
          action={
            <div className="flex space-x-2">
              <button
                onClick={() => scroll(-1)}
                aria-label="Previous"
                className={arrow}
              >
                <Icon name="chevron-left" size={18.8} />
              </button>
              <button
                onClick={() => scroll(1)}
                aria-label="Next"
                className={arrow}
              >
                <Icon name="chevron-right" size={18.8} />
              </button>
            </div>
          }
        />
        <div
          ref={scroller}
          className="no-scrollbar flex snap-x gap-4 overflow-x-auto"
        >
          {related.map((p) => (
            <div
              key={p._id}
              className="w-full shrink-0 snap-start min-[480px]:w-[calc(50%-8px)] md:w-[calc(33.33%-11px)] lg:w-[calc(25%-12px)] xl:w-[calc(20%-13px)]"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
