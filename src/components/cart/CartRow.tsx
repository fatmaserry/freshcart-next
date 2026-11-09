"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icons";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useRemoveCartItem, useUpdateCartItem } from "@/hooks/useCart";
import { StockGuard } from "@/lib/cart/StockGuard";
import { cn, formatNumber, formatPrice } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import type { CartItem } from "@/types/api";

const LOW_STOCK = 5;

export function CartRow({ item }: { item: CartItem }) {
  const { isAuthenticated } = useAuth();
  const update = useUpdateCartItem();
  const remove = useRemoveCartItem();
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  const p = item.product;
  const busy = update.isPending || remove.isPending;
  const outOfStock = StockGuard.isOutOfStock(p);
  const overStock =
    !outOfStock && typeof p.quantity === "number" && item.count > p.quantity;
  const hasStockIssue = outOfStock || overStock;
  const shortTitle =
    p.title.length > 40 ? `${p.title.slice(0, 40)}...` : p.title;

  return (
    <div
      className={cn(
        "relative rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md",
        outOfStock
          ? "border-red-200 bg-red-50"
          : "border-line-soft bg-surface-card",
        busy && "opacity-60",
      )}
    >
      {busy && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-surface-card/60 backdrop-blur-[2px]">
          <div className="flex items-center gap-2 rounded-full bg-surface-card px-4 py-2 shadow-lg">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
            <span className="text-sm font-medium text-body">Updating...</span>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-5">
        <div className="flex gap-4 sm:gap-6">
          <Link href={`/products/${p._id}`} className="group relative shrink-0">
            <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-line-soft bg-surface-media sm:h-32 sm:w-32">
              <Image
                src={p.imageCover}
                alt={p.title}
                fill
                sizes="128px"
                className={cn(
                  "object-contain p-3 transition-transform duration-300 group-hover:scale-110",
                  outOfStock && "opacity-60",
                )}
              />
            </div>
            {(isAuthenticated || hasStockIssue) && (
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white",
                  outOfStock
                    ? "bg-red-500"
                    : overStock
                      ? "bg-amber-500"
                      : "bg-green-500",
                )}
              >
                {hasStockIssue ? (
                  <Icon name="x" size={9.4} />
                ) : (
                  <Icon name="check" size={9.4} />
                )}
                {outOfStock
                  ? "Out of Stock"
                  : overStock
                    ? "Low Stock"
                    : "In Stock"}
              </div>
            )}
          </Link>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-3">
              <Link href={`/products/${p._id}`} className="group/title">
                <h3 className="text-base font-semibold leading-relaxed text-heading transition-colors group-hover/title:text-brand-600 sm:text-lg">
                  {p.title}
                </h3>
              </Link>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-block rounded-full bg-linear-to-r from-brand-50 to-emerald-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                  {p.category?.name}
                </span>
                {isAuthenticated && (
                  <>
                    <span className="text-xs text-hint">•</span>
                    <span className="text-xs text-muted">
                      SKU: {p._id.slice(-6).toUpperCase()}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-brand-600">
                  {formatPrice(item.price)}
                </span>
                {isAuthenticated && (
                  <span className="text-xs text-hint">per unit</span>
                )}
              </div>
              {outOfStock ? (
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                  <Icon name="alert-circle" size={14} /> Out of stock — not
                  included in your total
                </p>
              ) : overStock ? (
                <button
                  onClick={() =>
                    update.mutate({ productId: p._id, count: p.quantity })
                  }
                  className="mt-1 text-left text-xs font-semibold text-amber-700 underline-offset-2 hover:underline"
                >
                  Only {p.quantity} left in stock — set quantity to {p.quantity}
                </button>
              ) : (
                p.quantity <= LOW_STOCK && (
                  <p className="mt-1 text-xs font-medium text-amber-600">
                    Only {p.quantity} left in stock
                  </p>
                )
              )}
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="flex items-center rounded-xl border border-line-strong bg-surface-alt p-1">
                  <button
                    onClick={() =>
                      update.mutate({ productId: p._id, count: item.count - 1 })
                    }
                    disabled={item.count <= 1 || busy || outOfStock}
                    aria-label="Decrease quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-card text-muted shadow-sm transition-all hover:bg-surface-alt hover:text-body disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                  >
                    <Icon name="minus" size={14} />
                  </button>
                  <span
                    className="w-12 text-center font-bold text-heading"
                    aria-live="polite"
                  >
                    {item.count}
                  </span>
                  <button
                    onClick={() =>
                      update.mutate({ productId: p._id, count: item.count + 1 })
                    }
                    disabled={busy || outOfStock || item.count >= p.quantity}
                    aria-label="Increase quantity"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm shadow-brand-600/30 transition-all hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Icon name="plus" size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="mb-0.5 text-xs text-hint">Total</p>
                  <p
                    className={cn(
                      "text-xl font-bold",
                      outOfStock ? "text-hint line-through" : "text-heading",
                    )}
                  >
                    {formatNumber(item.price * item.count)}{" "}
                    <span className="text-sm font-medium text-hint">EGP</span>
                  </p>
                </div>
                <button
                  onClick={() => setConfirmingRemove(true)}
                  disabled={busy}
                  title="Remove item"
                  aria-label={`Remove ${p.title}`}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition-all duration-200 hover:border-red-500 hover:bg-red-500 hover:text-white disabled:opacity-40"
                >
                  <Icon name="trash" filled size={16.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmingRemove}
        icon={
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
            <Icon name="trash" size={32} />
          </div>
        }
        title="Remove Item?"
        message={
          <>
            Remove <span className="font-semibold text-body">{shortTitle}</span>{" "}
            from your cart?
          </>
        }
        confirmLabel="Remove"
        onCancel={() => setConfirmingRemove(false)}
        onConfirm={() => {
          setConfirmingRemove(false);
          remove.mutate(p._id);
        }}
      />
    </div>
  );
}
