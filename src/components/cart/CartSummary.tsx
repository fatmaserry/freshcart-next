"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icons";
import { useApplyCoupon } from "@/hooks/useCart";
import { FREE_SHIPPING_THRESHOLD, shippingFor } from "@/lib/cart/shipping";
import { cn, formatNumber, formatPrice } from "@/lib/utils";

const checkoutButton =
  "flex w-full items-center justify-center gap-3 rounded-xl bg-linear-to-r from-brand-600 to-brand-700 px-6 py-4 font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:from-brand-700 hover:to-brand-800 active:scale-[0.98]";

function PromoCode() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const applyCoupon = useApplyCoupon();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong py-3 text-body transition-all hover:border-brand-400 hover:bg-brand-50/50 hover:text-brand-600"
      >
        <Icon name="tag" size={18.8} />
        <span className="text-sm font-medium">Apply Promo Code</span>
      </button>
    );
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!code.trim()) return;
    applyCoupon.mutate(code, {
      onSuccess: () => {
        setCode("");
        setOpen(false);
      },
    });
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        autoFocus
        value={code}
        onChange={(event) => setCode(event.target.value)}
        placeholder="Promo code"
        aria-label="Promo code"
        className="min-w-0 flex-1 rounded-xl border border-line-strong bg-surface-card px-4 py-3 text-sm text-heading placeholder:text-hint focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
      <button
        type="submit"
        disabled={applyCoupon.isPending}
        className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {applyCoupon.isPending ? "Applying..." : "Apply"}
      </button>
    </form>
  );
}

export function CartSummary({
  subtotal,
  items,
  hasStockIssues,
}: {
  subtotal: number;
  items: number;
  hasStockIssues: boolean;
}) {
  const shipping = shippingFor(subtotal);
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  return (
    <div className="sticky top-24 overflow-hidden rounded-2xl border border-line-soft bg-surface-card shadow-sm">
      <div className="bg-linear-to-r from-brand-600 to-brand-700 px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <Icon name="shopping-bag" size={21.2} /> Order Summary
        </h2>
        <p className="mt-1 text-sm text-brand-100">
          {items} {items === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="space-y-5 p-6">
        {remaining > 0 ? (
          <div className="rounded-xl bg-linear-to-r from-orange-50 to-amber-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Icon name="truck" size={18.8} className="text-orange-500" />
              <span className="text-sm font-medium text-body">
                Add {formatPrice(remaining)} for free shipping
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-orange-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-orange-400 to-amber-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl bg-linear-to-r from-green-50 to-emerald-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Icon name="truck" size={18.8} className="text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-700">Free Shipping!</p>
              <p className="text-sm text-green-600">
                You qualify for free delivery
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex justify-between text-body">
            <span>Subtotal</span>
            <span className="font-medium text-heading">
              {formatPrice(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-body">
            <span>Shipping</span>
            {shipping === 0 ? (
              <span className="font-medium text-green-600">FREE</span>
            ) : (
              <span className="font-medium text-heading">
                {formatPrice(shipping)}
              </span>
            )}
          </div>
          <div className="mt-3 border-t border-dashed border-line-strong pt-3">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold text-heading">Total</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-heading">
                  {formatNumber(subtotal + shipping)}
                </span>
                <span className="ml-1 text-sm text-muted">EGP</span>
              </div>
            </div>
          </div>
        </div>

        <PromoCode />

        {hasStockIssues ? (
          <>
            <button
              disabled
              className={cn(checkoutButton, "cursor-not-allowed opacity-60")}
            >
              <Icon name="lock" size={18.8} />
              <span>Secure Checkout</span>
            </button>
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-center text-xs font-medium text-red-700"
            >
              Some items are out of stock or exceed the available quantity.
              Update them to continue.
            </p>
          </>
        ) : (
          <Link href="/checkout" className={checkoutButton}>
            <Icon name="lock" size={18.8} />
            <span>Secure Checkout</span>
          </Link>
        )}

        <div className="flex items-center justify-center gap-4 py-2">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Icon name="shield-check" size={14} className="text-green-500" />
            <span>Secure Payment</span>
          </div>
          <div className="h-4 w-px bg-line-soft" />
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Icon name="truck" size={14} className="text-blue-500" />
            <span>Fast Delivery</span>
          </div>
        </div>

        <Link
          href="/"
          className="block py-2 text-center text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export function GuestCartSummary({
  subtotal,
  items,
}: {
  subtotal: number;
  items: number;
}) {
  return (
    <div className="sticky top-24 overflow-hidden rounded-2xl border border-line-soft bg-surface-card shadow-sm">
      <div className="bg-heading p-5">
        <h2 className="text-lg font-bold text-surface-page">Order Summary</h2>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex justify-between text-body">
          <span>Subtotal ({items} items)</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-body">
          <span>Shipping</span>
          <span className="font-medium text-green-600">
            Calculated at checkout
          </span>
        </div>
        <hr className="border-line-soft" />
        <div className="flex justify-between text-lg font-bold">
          <span>Estimated Total</span>
          <span className="text-brand-600">{formatPrice(subtotal)}</span>
        </div>
        <div className="space-y-3 pt-4">
          <Link
            href="/login?redirect=/cart"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 font-semibold text-white transition-all hover:bg-brand-700"
          >
            <Icon name="user" size={18.8} /> Login to Checkout
          </Link>
          <p className="text-center text-xs text-hint">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-brand-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
        <div className="space-y-2 border-t border-line-soft pt-4">
          <p className="text-xs text-muted">✓ Your cart items will be saved</p>
          <p className="text-xs text-muted">✓ Track your orders easily</p>
          <p className="text-xs text-muted">✓ Access exclusive member deals</p>
        </div>
      </div>
    </div>
  );
}
