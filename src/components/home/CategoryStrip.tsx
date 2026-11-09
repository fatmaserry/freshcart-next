"use client";

import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/hooks/useCatalog";
import { SectionHeading, SectionLink } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export function CategoryStrip() {
  const { data, isLoading } = useCategories();

  return (
    <section className="container-page pb-10 pt-18">
      <SectionHeading
        title="Shop By"
        highlight="Category"
        action={
          <SectionLink href="/categories">View All Categories</SectionLink>
        }
      />
      <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-37" />
            ))
          : data?.data.map((c) => (
              <Link
                key={c._id}
                href={`/categories/${c._id}`}
                className="group flex flex-col items-center rounded-lg bg-surface-card p-4 text-center shadow-sm ring-1 ring-line-soft transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-full bg-surface-muted">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="80px"
                    className="object-cover transition duration-300 group-hover:scale-110"
                  />
                </div>
                <p className="mt-3 font-medium text-body group-hover:text-brand-600">
                  {c.name}
                </p>
              </Link>
            ))}
      </div>
    </section>
  );
}
