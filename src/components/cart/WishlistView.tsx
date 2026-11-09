"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { useToggleWishlist, useWishlist } from "@/hooks/useWishlist";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/providers/AuthProvider";
import { formatPrice, getErrorMessage } from "@/lib/utils";
import { ErrorState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import type { Product } from "@/types/api";

function WishlistRow({ product }: { product: Product }) {
  const wishlist = useToggleWishlist();
  const cart = useAddToCart();
  const removing =
    wishlist.isPending && wishlist.variables?.productId === product._id;
  const inStock = product.quantity > 0;

  return (
    <div className="grid grid-cols-1 items-center gap-4 border-b border-line-soft p-4 transition-colors last:border-b-0 hover:bg-surface-alt/50 md:grid-cols-12 md:px-6 md:py-5">
      <div className="flex items-center gap-4 md:col-span-6">
        <Link
          href={`/products/${product._id}`}
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-line-soft bg-surface-media"
        >
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="80px"
            className="object-contain p-2"
          />
        </Link>
        <div className="min-w-0">
          <Link
            href={`/products/${product._id}`}
            className="line-clamp-2 font-medium text-heading transition-colors hover:text-brand-600"
          >
            {product.title}
          </Link>
          <p className="mt-1 text-sm text-hint">{product.category?.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:col-span-2 md:justify-center">
        <span className="text-sm text-muted md:hidden">Price:</span>
        <div className="text-right md:text-center">
          <p className="font-semibold text-heading">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:col-span-2 md:justify-center">
        <span className="text-sm text-muted md:hidden">Status:</span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-green-500" : "bg-red-500"}`}
          />
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      <div className="flex items-center gap-2 md:col-span-2 md:justify-center">
        <button
          onClick={() => cart.addToCart(product._id)}
          disabled={!inStock || cart.isPending}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-700 disabled:opacity-60 md:flex-none"
        >
          {cart.isPending ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <Icon name="shopping-cart" size={16} />
          )}{" "}
          Add to Cart
        </button>
        <button
          onClick={() => wishlist.toggle(product._id)}
          disabled={removing}
          aria-label={`Remove ${product.title} from wishlist`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line-soft text-hint transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
        >
          {removing ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <Icon name="trash" filled size={16} />
          )}
        </button>
      </div>
    </div>
  );
}

function EmptyWishlist({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <div className="container-page flex flex-col items-center py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-muted text-hint">
        <Icon name="heart" size={38} />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-heading">
        Your wishlist is empty
      </h2>
      <p className="mb-8 max-w-sm text-muted">
        Browse products and save your favorites here.
        {!isAuthenticated && " Sign in to sync your wishlist across devices."}
      </p>
      <div className="flex w-full max-w-xs flex-col gap-3">
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
        >
          Browse Products <Icon name="arrow-right" size={16} />
        </Link>
        {!isAuthenticated && (
          <Link
            href="/login?redirect=/wishlist"
            className="inline-flex items-center justify-center rounded-xl border border-line-soft bg-surface-card px-6 py-3 font-semibold text-body transition hover:border-brand-500 hover:text-brand-600"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}

export function WishlistView() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, error, refetch } = useWishlist();
  const items = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="container-page space-y-3 py-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    );
  }
  if (error)
    return (
      <div className="container-page py-8">
        <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
      </div>
    );
  if (!items.length) return <EmptyWishlist isAuthenticated={isAuthenticated} />;

  return (
    <>
      <div className="border-b border-line-soft bg-surface-card">
        <div className="container-page py-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-2 text-sm text-muted"
          >
            <Link href="/" className="transition-colors hover:text-brand-600">
              Home
            </Link>
            <span>/</span>
            <span className="font-medium text-heading">Wishlist</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <Icon name="heart" filled size={23.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-heading">My Wishlist</h1>
              <p className="text-sm text-muted">
                {items.length} {items.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-8">
        <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface-card">
          <div className="hidden grid-cols-12 gap-4 border-b border-line-soft bg-surface-alt px-6 py-4 text-sm font-medium text-muted md:grid">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-2 text-center">Actions</div>
          </div>
          {items.map((p) => (
            <WishlistRow key={p._id} product={p} />
          ))}
        </div>
        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/products"
            className="text-sm font-medium text-muted transition-colors hover:text-brand-600"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
}
