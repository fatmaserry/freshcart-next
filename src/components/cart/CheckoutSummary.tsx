"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/Spinner";
import { shippingFor } from "@/lib/cart/shipping";
import { StockGuard } from "@/lib/cart/StockGuard";
import type { PaymentMethod } from "@/lib/payment";
import { formatNumber, formatPrice } from "@/lib/utils";
import type { CartView } from "@/types/api";

export function CheckoutSummary({
  cart,
  method,
  isSubmitting,
  isBlocked,
  onSubmit,
}: {
  cart: CartView;
  method: PaymentMethod;
  isSubmitting: boolean;
  isBlocked: boolean;
  onSubmit: () => void;
}) {
  const items = StockGuard.available(cart);
  const excluded = cart.data.products.length - items.length;
  const subtotal = StockGuard.payableTotal(cart);
  const shipping = shippingFor(subtotal);
  const hasStockIssues = StockGuard.issues(cart).blocksCheckout;

  return (
    <aside className="sticky top-24 overflow-hidden rounded-2xl border border-line-soft bg-surface-card shadow-sm lg:col-span-1">
      <div className="bg-linear-to-r from-brand-600 to-brand-700 px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <Icon name="shopping-bag" size={21.2} /> Order Summary
        </h2>
        <p className="mt-1 text-sm text-brand-100">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="p-6">
        {excluded > 0 && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            {excluded} out-of-stock {excluded === 1 ? "item" : "items"}{" "}
            won&apos;t be ordered and will leave your cart.
          </p>
        )}
        <ul className="max-h-72 space-y-3 overflow-y-auto">
          {items.map((i) => (
            <li
              key={i._id}
              className="flex items-center gap-3 rounded-xl bg-surface-alt p-3"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-media">
                <Image
                  src={i.product.imageCover}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-contain p-1"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-heading">
                  {i.product.title}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {i.count} × {formatPrice(i.price)}
                </p>
              </div>
              <p className="text-sm font-bold text-heading">
                {formatNumber(i.price * i.count)}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-5 space-y-3 border-t border-line-soft pt-5">
          <div className="flex justify-between text-body">
            <span>Subtotal</span>
            <span className="font-medium text-heading">
              {formatPrice(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-body">
            <span className="flex items-center gap-2">
              <Icon name="truck" size={18.8} className="text-hint" /> Shipping
            </span>
            {shipping === 0 ? (
              <span className="font-medium text-green-600">FREE</span>
            ) : (
              <span className="font-medium text-heading">
                {formatPrice(shipping)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between border-t border-line-soft pt-3">
          <span className="text-lg font-bold text-heading">Total</span>
          <div>
            <span className="text-2xl font-bold text-brand-600">
              {formatNumber(subtotal + shipping)}
            </span>
            <span className="ml-1 text-sm text-muted">EGP</span>
          </div>
        </div>

        {hasStockIssues && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
          >
            Some items are out of stock or exceed the available quantity.{" "}
            <Link href="/cart" className="underline">
              Update your cart
            </Link>{" "}
            to continue.
          </p>
        )}

        <button
          onClick={onSubmit}
          disabled={hasStockIssues || isSubmitting || isBlocked}
          className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl bg-linear-to-r from-brand-600 to-brand-700 px-6 py-4 font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:from-brand-700 hover:to-brand-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <Icon name={method.submitIcon} size={18.8} />
          )}
          {method.submitLabel}
        </button>

        <div className="mt-5 flex items-center justify-center gap-4 border-t border-line-soft pt-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <Icon name="shield-check" size={14} className="text-green-500" />{" "}
            Secure
          </span>
          <span className="h-4 w-px bg-line-soft" />
          <span className="flex items-center gap-1.5">
            <Icon name="truck" size={14} className="text-blue-500" /> Fast
            Delivery
          </span>
          <span className="h-4 w-px bg-line-soft" />
          <span className="flex items-center gap-1.5">
            <Icon name="package" size={14} className="text-orange-500" /> Easy
            Returns
          </span>
        </div>
      </div>
    </aside>
  );
}
