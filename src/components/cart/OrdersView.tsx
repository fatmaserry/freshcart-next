"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Icon, type IconRef } from "@/components/ui/icons";
import { useOrders } from "@/hooks/useAccount";
import { findPaymentMethod } from "@/lib/payment";
import { queryKeys } from "@/lib/query/keys";
import { cn, formatNumber, formatPrice, getErrorMessage } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState, ErrorState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Order } from "@/types/api";

const orderDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

function orderStatus(order: Order): {
  label: string;
  icon: IconRef;
  className: string;
} {
  if (order.isDelivered)
    return {
      label: "Delivered",
      icon: "check-circle",
      className: "bg-green-100 text-green-700",
    };
  if (order.isPaid)
    return {
      label: "Paid",
      icon: "credit-card",
      className: "bg-blue-100 text-blue-700",
    };
  return {
    label: "Processing",
    icon: { name: "clock", filled: true },
    className: "bg-amber-100 text-amber-700",
  };
}

const Dot = () => <span className="h-1 w-1 rounded-full bg-line-strong" />;

function OrderDetails({ order }: { order: Order }) {
  const { shippingAddress: address, shippingPrice } = order;
  const subtotal = order.totalOrderPrice - shippingPrice;

  return (
    <div className="space-y-4 border-t border-line-soft bg-surface-alt/50 p-6 animate-fade-in">
      <p className="flex items-center gap-2 text-sm font-semibold text-heading">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-100 text-brand-600">
          <Icon name="receipt" size={14} />
        </span>
        Order Items
      </p>

      <ul className="space-y-3">
        {order.cartItems.map((i) => (
          <li
            key={i._id}
            className="flex items-center gap-4 rounded-xl border border-line-soft bg-surface-card p-3"
          >
            <Link
              href={`/products/${i.product._id}`}
              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-media"
            >
              <Image
                src={i.product.imageCover}
                alt={i.product.title}
                fill
                sizes="56px"
                className="object-contain p-1"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${i.product._id}`}
                className="line-clamp-1 font-medium text-heading hover:text-brand-600"
              >
                {i.product.title}
              </Link>
              <p className="text-sm text-muted">
                {i.count} × {formatPrice(i.price)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-heading">
                {formatNumber(i.price * i.count)}
              </p>
              <p className="text-xs text-hint">EGP</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="grid gap-4 md:grid-cols-2">
        {address && (
          <div className="rounded-xl border border-line-soft bg-surface-card p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-heading">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                <Icon name="map-pin" size={14} />
              </span>
              Delivery Address
            </p>
            <p className="font-medium text-heading">{address.city}</p>
            <p className="mt-1 text-sm text-body">{address.details}</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-body">
              <Icon name="phone" size={14} className="text-hint" />
              {address.phone}
            </p>
          </div>
        )}

        <div className="rounded-xl bg-amber-100 p-4">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-heading">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500 text-white">
              <Icon name="receipt" size={14} />
            </span>
            Order Summary
          </p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between text-body">
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-body">
              <dt>Shipping</dt>
              <dd>{shippingPrice ? formatPrice(shippingPrice) : "Free"}</dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-amber-500/30 pt-2 font-semibold text-heading">
              <dt>Total</dt>
              <dd className="text-base font-bold">
                {formatPrice(order.totalOrderPrice)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const units = order.cartItems.reduce((s, i) => s + i.count, 0);
  const payment = findPaymentMethod(order.paymentMethodType);
  const status = orderStatus(order);
  const extraItems = order.cartItems.length - 1;

  return (
    <li
      className={cn(
        "overflow-hidden rounded-2xl border bg-surface-card shadow-sm transition-shadow hover:shadow-md",
        open ? "border-brand-200" : "border-line-soft",
      )}
    >
      <div className="flex gap-4 p-6 sm:gap-5">
        <div className="relative h-20 w-20 shrink-0 sm:h-28 sm:w-28">
          <div className="relative h-full w-full overflow-hidden rounded-2xl border border-line-soft bg-surface-media">
            {order.cartItems[0] && (
              <Image
                src={order.cartItems[0].product.imageCover}
                alt=""
                fill
                sizes="112px"
                className="object-contain p-3"
              />
            )}
          </div>
          {extraItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-heading text-[10px] font-bold text-surface-page">
              +{extraItems}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold",
                  status.className,
                )}
              >
                <Icon name={status.icon} size={14} /> {status.label}
              </span>
              <p className="mt-2 text-lg font-bold text-heading">
                <span className="mr-1.5 font-normal text-hint">#</span>
                {order.id}
              </p>
            </div>
            {payment && (
              <span
                title={payment.orderLabel}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-muted"
              >
                <Icon name={payment.icon} size={18.8} />
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span className="flex items-center gap-2">
              <Icon name="calendar-days" size={14} className="text-hint" />{" "}
              {orderDate(order.createdAt)}
            </span>
            <Dot />
            <span className="flex items-center gap-2">
              <Icon name="package" size={14} className="text-hint" /> {units}{" "}
              {units === 1 ? "item" : "items"}
            </span>
            {order.shippingAddress && (
              <>
                <Dot />
                <span className="flex items-center gap-2">
                  <Icon name="map-pin" size={14} className="text-hint" />{" "}
                  {order.shippingAddress.city}
                </span>
              </>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-2xl font-bold text-heading">
              {formatNumber(order.totalOrderPrice)}{" "}
              <span className="text-sm font-medium text-hint">EGP</span>
            </p>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className={cn(
                "flex h-10 items-center gap-2 rounded-xl px-4 font-medium transition-colors",
                open
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700"
                  : "bg-surface-muted text-body hover:bg-line-strong",
              )}
            >
              {open ? "Hide" : "Details"}
              <Icon
                name="chevron-down"
                size={14}
                className={cn("transition-transform", open && "rotate-180")}
              />
            </button>
          </div>
        </div>
      </div>

      {open && <OrderDetails order={order} />}
    </li>
  );
}

export function OrdersView() {
  const qc = useQueryClient();
  const { data: orders, isLoading, error, refetch } = useOrders();

  // Returning from Stripe: the server has already turned the cart into an order.
  useEffect(() => {
    qc.invalidateQueries({ queryKey: queryKeys.cart });
  }, [qc]);

  const count = orders?.length ?? 0;

  return (
    <div className="py-8">
      <div className="container-page">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="transition hover:text-brand-600">
            Home
          </Link>
          <span className="text-line-strong">/</span>
          <span className="font-medium text-heading">My Orders</span>
        </nav>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25">
              <Icon name="shopping-bag" size={28.2} />
            </span>
            <div>
              <h1 className="text-3xl font-bold text-heading">My Orders</h1>
              <p className="text-muted">
                {count > 0
                  ? `Track and manage your ${count} ${count === 1 ? "order" : "orders"}`
                  : "Track and manage your orders"}
              </p>
            </div>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 px-4 py-2 font-medium text-brand-600 transition-colors hover:text-brand-700"
          >
            <Icon name="shopping-bag" size={16.5} /> Continue Shopping
          </Link>
        </div>

        {isLoading || (!orders && !error) ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
        ) : count === 0 ? (
          <EmptyState
            icon={<Icon name="package" size={28} />}
            title="No orders yet"
            description="When you place an order it will show up here."
            action={<ButtonLink href="/products">Start shopping</ButtonLink>}
          />
        ) : (
          <ul className="space-y-4">
            {orders?.map((o) => (
              <OrderCard key={o._id} order={o} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
