"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icons";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useCart, useClearCart } from "@/hooks/useCart";
import { StockGuard } from "@/lib/cart/StockGuard";
import { useAuth } from "@/providers/AuthProvider";
import { CartRow } from "./CartRow";
import { CartSummary, GuestCartSummary } from "./CartSummary";

const popularCategories = ["Electronics", "Fashion", "Home", "Beauty"];

function EmptyCart({ showCategories }: { showCategories: boolean }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="relative mb-8">
          <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br from-surface-muted to-surface-alt">
            <Icon
              name="package-search"
              size={56.5}
              className="text-line-strong"
            />
          </div>
          <div className="absolute -bottom-2 left-1/2 h-4 w-24 -translate-x-1/2 rounded-full bg-surface-muted blur-md" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-heading">
          Your cart is empty
        </h2>
        <p className="mb-8 leading-relaxed text-muted">
          Looks like you haven&apos;t added anything to your cart yet.
          <br />
          Start exploring our products!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-brand-600 to-brand-700 px-8 py-3.5 font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:from-brand-700 hover:to-brand-800 active:scale-[0.98]"
        >
          Start Shopping <Icon name="arrow-right" size={16.5} />
        </Link>
        {showCategories && (
          <div className="mt-12 border-t border-line-soft pt-8">
            <p className="mb-4 text-sm text-hint">Popular Categories</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularCategories.map((c) => (
                <Link
                  key={c}
                  href="/categories"
                  className="rounded-full bg-surface-alt px-4 py-2 text-sm font-medium text-body transition-colors hover:bg-brand-50 hover:text-brand-600"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CartView() {
  const { data: cart, isLoading, error } = useCart();
  const { isAuthenticated } = useAuth();
  const clear = useClearCart();
  const [confirmingClear, setConfirmingClear] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
          <Icon
            name="spinner"
            size={35.3}
            className="animate-spin text-brand-600"
          />
        </div>
        <p className="mt-6 font-medium text-body">Loading your cart...</p>
        <p className="mt-1 text-sm text-hint">Just a moment</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-page py-12">
        <div className="mx-auto max-w-md rounded-2xl border border-red-100 bg-linear-to-br from-red-50 to-orange-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <span className="text-3xl">😕</span>
          </div>
          <h2 className="mb-2 text-xl font-bold text-heading">
            Oops! Something went wrong
          </h2>
          <p className="mb-6 text-body">
            We couldn&apos;t load your cart. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!cart?.data.products.length)
    return <EmptyCart showCategories={isAuthenticated} />;

  const items = cart.numOfCartItems;
  const subtotal = StockGuard.payableTotal(cart);
  const payableItems = StockGuard.available(cart).length;

  return (
    <div className="min-h-screen bg-surface-alt py-8">
      <div className="container-page">
        <div className="mb-8">
          <nav className="mb-4 flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="transition hover:text-brand-600">
              Home
            </Link>
            <span>/</span>
            <span className="font-medium text-heading">Shopping Cart</span>
          </nav>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-heading">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r from-brand-600 to-brand-700 text-white">
              <Icon name="shopping-cart" size={18.8} />
            </span>
            Shopping Cart
          </h1>
          <p className="mt-2 text-muted">
            You have{" "}
            <span className="font-semibold text-brand-600">
              {items} {items === 1 ? "item" : "items"}
            </span>{" "}
            in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.data.products.map((item) => (
                <CartRow key={item._id} item={item} />
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-line-strong pt-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                <span>←</span> Continue Shopping
              </Link>
              <button
                onClick={() => setConfirmingClear(true)}
                disabled={clear.isPending}
                className="group flex items-center gap-2 text-sm text-hint transition-colors hover:text-red-500 disabled:opacity-50"
              >
                <Icon
                  name="trash"
                  filled
                  size={14}
                  className="transition-transform group-hover:scale-110"
                />
                <span>Clear all items</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            {isAuthenticated ? (
              <CartSummary
                subtotal={subtotal}
                items={payableItems}
                hasStockIssues={StockGuard.issues(cart).blocksCheckout}
              />
            ) : (
              <GuestCartSummary subtotal={subtotal} items={payableItems} />
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmingClear}
        icon={
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-red-50 to-orange-50 text-red-500">
            <Icon name="shopping-cart" size={40} />
          </div>
        }
        title="Clear Your Cart?"
        message="All items will be removed from your cart. This action cannot be undone."
        confirmLabel="Yes, Clear All"
        cancelLabel="Keep Shopping"
        onCancel={() => setConfirmingClear(false)}
        onConfirm={() => {
          setConfirmingClear(false);
          clear.mutate();
        }}
      />
    </div>
  );
}
