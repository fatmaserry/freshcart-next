"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { Stars } from "@/components/ui/Rating";
import type { Product } from "@/types/api";
import { cn, formatPrice } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";
import { useAddToCart } from "@/hooks/useCart";
import { useToggleWishlist } from "@/hooks/useWishlist";

export function ProductCard({
  product,
  priority,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { addToCart, isPending } = useAddToCart();
  const wishlist = useToggleWishlist();
  const liked = wishlist.isInWishlist(product._id);
  const soldOut = product.quantity <= 0;
  const iconBtn =
    "flex h-8 w-8 items-center justify-center rounded-full bg-surface-card shadow-sm transition";

  return (
    <article className="relative flex flex-col overflow-hidden rounded-lg border border-line-strong bg-surface-card transition duration-200 hover:-translate-y-1.25 hover:shadow-lg">
      <div className="relative">
        <Link
          href={`/products/${product._id}`}
          aria-label={product.title}
          className="relative block h-60 bg-surface-media"
        >
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-contain"
          />
        </Link>
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            onClick={() => wishlist.toggle(product._id)}
            disabled={
              wishlist.isPending &&
              wishlist.variables?.productId === product._id
            }
            aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
            className={cn(
              iconBtn,
              liked
                ? "text-red-500 hover:text-red-600"
                : "text-body hover:text-red-500",
            )}
          >
            <Icon name="heart" size={18.8} filled={liked} />
          </button>
          <button
            type="button"
            aria-label="Refresh"
            className={cn(iconBtn, "text-body hover:text-brand-600")}
          >
            <Icon name="refresh" size={18.8} />
          </button>
          <Link
            href={`/products/${product._id}`}
            aria-label="Quick view"
            className={cn(iconBtn, "text-body hover:text-brand-600")}
          >
            <Icon name="eye" size={18.8} />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 text-xs text-muted">{product.category.name}</div>
        <Link
          href={`/products/${product._id}`}
          className="mb-1 line-clamp-2 font-medium text-heading hover:text-brand-600"
        >
          {product.title}
        </Link>
        <div className="mb-2 flex items-center gap-2">
          <Stars value={product.ratingsAverage} />
          <span className="text-xs text-muted">
            {product.ratingsAverage} ({product.ratingsQuantity})
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-heading">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => addToCart(product._id)}
            disabled={isPending || soldOut}
            aria-label={soldOut ? "Out of stock" : "Add to cart"}
            title={soldOut ? "Out of stock" : "Add to cart"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-line-strong"
          >
            {isPending ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Icon name="plus" size={18.8} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-line-strong bg-surface-card">
      <div className="h-60 animate-pulse bg-surface-muted" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-line-strong" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-line-strong" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-line-strong" />
        <div className="flex justify-between pt-3">
          <div className="h-6 w-20 animate-pulse rounded bg-line-strong" />
          <div className="h-10 w-10 animate-pulse rounded-full bg-line-strong" />
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({
  products,
  loading,
  skeletons = 10,
  priorityCount = 0,
  className = "grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
}: {
  products?: Product[];
  loading?: boolean;
  skeletons?: number;
  priorityCount?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid", className)}>
      {loading
        ? Array.from({ length: skeletons }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))
        : products?.map((p, i) => (
            <ProductCard key={p._id} product={p} priority={i < priorityCount} />
          ))}
    </div>
  );
}
