"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "@/components/ui/icons";
import { useCategory, useCategorySubcategories } from "@/hooks/useCatalog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

export function CategoryDetailsView() {
  const { id } = useParams<{ id: string }>();
  const { data: category, isLoading, error } = useCategory(id);
  const subs = useCategorySubcategories(id);
  const subcategories = subs.data?.data ?? [];
  const name = category?.name ?? "Loading...";

  if (error) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<Icon name="layout-grid" size={28} />}
          title="Category not found"
          action={<ButtonLink href="/categories">All categories</ButtonLink>}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt/50">
      {category && <title>{`${category.name} · FreshCart`}</title>}
      <div className="bg-linear-to-br from-brand-600 via-brand-500 to-brand-400 text-white">
        <div className="container-page py-12 sm:py-16">
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <Link
              href="/categories"
              className="transition-colors hover:text-white"
            >
              Categories
            </Link>
            <span className="text-white/40">/</span>
            <span className="font-medium text-white">{name}</span>
          </nav>
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/20 shadow-xl ring-1 ring-white/30 backdrop-blur-sm">
              {category?.image ? (
                <span className="relative h-12 w-12">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </span>
              ) : (
                <Icon name="layers" size={35} />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {name}
              </h1>
              <p className="mt-1 text-white/80">
                Choose a subcategory to browse products
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-10">
        <Link
          href="/categories"
          className="mb-6 inline-flex items-center gap-2 text-body transition-colors hover:text-brand-600"
        >
          <Icon name="arrow-left" size={18.8} />
          <span>Back to Categories</span>
        </Link>

        {isLoading || subs.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Icon
                name="spinner"
                size={42}
                className="mb-4 animate-spin text-brand-600"
              />
              <p className="text-muted">Loading subcategories...</p>
            </div>
          </div>
        ) : subcategories.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-heading">
                {subcategories.length} Subcategories in {category?.name}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {subcategories.map((s) => (
                <Link
                  key={s._id}
                  href={`/products?subcategory=${s._id}`}
                  className="group rounded-2xl border border-line-soft bg-surface-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 transition-colors group-hover:bg-brand-100">
                    <Icon
                      name="folder-open"
                      size={28}
                      className="text-brand-600"
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-heading transition-colors group-hover:text-brand-600">
                    {s.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
                    <span>Browse Products</span>
                    <Icon name="arrow-right" size={14} />
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-surface-muted">
              <Icon name="folder-open" size={35} className="text-hint" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-heading">
              No Subcategories Found
            </h3>
            <p className="mb-6 text-muted">
              This category doesn&apos;t have any subcategories yet.
            </p>
            <Link
              href={`/products?category=${id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
            >
              View All Products in {category?.name}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
