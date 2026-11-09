"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Icon } from "@/components/ui/icons";
import { toast } from "react-toastify";
import { queryKeys } from "@/lib/query/keys";
import { useCart } from "@/hooks/useCart";
import { usePlaceOrder } from "@/hooks/useCheckout";
import {
  defaultPaymentMethod,
  paymentMethods,
  type PaymentMethod,
} from "@/lib/payment";
import { useAddAddress, useAddresses } from "@/hooks/useAccount";
import { useLocations } from "@/hooks/useLocations";
import { LocationFields } from "@/components/account/LocationFields";
import { getErrorMessage } from "@/lib/utils";
import {
  shippingSchemaFor,
  type ShippingValues,
} from "@/lib/validation/schemas/shipping";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ShippingAddress } from "@/types/api";
import { CheckoutSummary } from "./CheckoutSummary";
import {
  AddressOption,
  CheckoutField,
  CheckoutSection,
  PaymentOption,
} from "./CheckoutParts";

const NEW = "new";

export function CheckoutView() {
  const router = useRouter();
  const qc = useQueryClient();
  const { data: cart, isLoading } = useCart();
  const addresses = useAddresses();
  const { data: locations } = useLocations();
  const [method, setMethod] = useState<PaymentMethod>(defaultPaymentMethod);
  const [selected, setSelected] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(true);
  const shippingSchema = useMemo(
    () => shippingSchemaFor(locations),
    [locations],
  );
  const form = useForm<ShippingValues>({
    resolver: zodResolver(shippingSchema),
  });

  const saved = addresses.data?.data ?? [];
  const selectedId = selected ?? NEW;

  const saveNewAddress = useAddAddress();
  const placeOrder = usePlaceOrder({
    onSuccess: (result) => {
      if (result.kind === "redirect") {
        toast.loading("Redirecting to secure payment…");
        window.location.href = result.url;
        return;
      }
      qc.invalidateQueries({ queryKey: queryKeys.cart });
      qc.invalidateQueries({ queryKey: queryKeys.allOrders });
      toast.success(result.message);
      router.push("/orders");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const order = (shipping: ShippingAddress, isNew: boolean) => {
    if (!cart) return;
    // A retry after a failed order must not save the same address again.
    const alreadySaved = saved.some(
      (a) =>
        a.details === shipping.details &&
        a.phone === shipping.phone &&
        a.city === shipping.city,
    );
    if (isNew && saveAddress && !alreadySaved)
      saveNewAddress.mutate({ name: `${shipping.city} address`, ...shipping });
    placeOrder.mutate({ cart, shipping, method });
  };

  const submit = () => {
    if (selectedId === NEW) {
      form.handleSubmit((v) => {
        // Non-null because the schema already validated this pair.
        const location = locations!.resolve(v.governorate, v.city)!;
        order(
          { details: v.details, phone: v.phone, city: location.label },
          true,
        );
      })();
    } else {
      const a = saved.find((x) => x._id === selectedId)!;
      order({ details: a.details, phone: a.phone, city: a.city }, false);
    }
  };

  if (isLoading)
    return (
      <div className="container-page grid gap-8 py-8 lg:grid-cols-3">
        <Skeleton className="h-125 lg:col-span-2" />
        <Skeleton className="h-96" />
      </div>
    );
  if (!cart?.data.products.length) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<Icon name="shopping-bag" size={28} />}
          title="Nothing to check out"
          description="Add some products to your cart first."
          action={<ButtonLink href="/products">Browse products</ButtonLink>}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt py-8">
      <div className="container-page">
        <div className="mb-8">
          <nav className="mb-4 flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="transition hover:text-brand-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/cart" className="transition hover:text-brand-600">
              Cart
            </Link>
            <span>/</span>
            <span className="font-medium text-heading">Checkout</span>
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-bold text-heading">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r from-brand-600 to-brand-700 text-white">
                  <Icon name="receipt" size={23.5} />
                </span>
                Complete Your Order
              </h1>
              <p className="mt-2 text-muted">
                Review your items and complete your purchase
              </p>
            </div>
            <Link
              href="/cart"
              className="flex items-center gap-2 font-medium text-brand-600 transition-colors hover:text-brand-700"
            >
              <Icon name="arrow-left" size={16.5} /> Back to Cart
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <CheckoutSection
              icon="home"
              title="Shipping Address"
              subtitle="Where should we deliver your order?"
            >
              {(addresses.isLoading || saved.length > 0) && (
                <div className="mb-5 border-b border-line-soft pb-5">
                  <p className="flex items-center gap-2 font-medium text-heading">
                    <Icon
                      name="bookmark"
                      size={16.5}
                      className="text-brand-600"
                    />
                    Saved Addresses
                  </p>
                  <p className="mb-3 mt-1 text-sm text-muted">
                    Select a saved address or enter a new one below
                  </p>
                  <div className="space-y-3">
                    {addresses.isLoading && <Skeleton className="h-20" />}
                    {saved.map((a) => (
                      <AddressOption
                        key={a._id}
                        icon="map-pin"
                        active={selectedId === a._id}
                        onClick={() => setSelected(a._id)}
                      >
                        <p className="font-semibold text-heading">{a.name}</p>
                        <p className="mt-0.5 text-sm text-body">{a.details}</p>
                        <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                          <span className="flex items-center gap-1">
                            <Icon name="phone" size={12} /> {a.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="city" size={12} /> {a.city}
                          </span>
                        </p>
                      </AddressOption>
                    ))}
                    <AddressOption
                      dashed
                      icon="plus"
                      active={selectedId === NEW}
                      onClick={() => setSelected(NEW)}
                    >
                      <p className="font-semibold text-heading">
                        Use a different address
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        Enter a new shipping address manually
                      </p>
                    </AddressOption>
                  </div>
                </div>
              )}

              {selectedId === NEW && !addresses.isLoading && (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-4">
                    <Icon
                      name="circle-info"
                      size={18.8}
                      className="shrink-0 text-blue-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        Delivery Information
                      </p>
                      <p className="text-xs text-blue-600">
                        Please ensure your address is accurate for smooth
                        delivery
                      </p>
                    </div>
                  </div>
                  <LocationFields
                    control={form.control}
                    errors={form.formState.errors}
                    setValue={form.setValue}
                    prominent
                  />
                  <CheckoutField
                    label="Street Address"
                    icon="map-pin"
                    textarea
                    placeholder="Street, building, apartment"
                    error={form.formState.errors.details?.message}
                    registration={form.register("details")}
                  />
                  <CheckoutField
                    label="Phone Number"
                    icon="phone"
                    type="tel"
                    placeholder="01012345678"
                    hint="Egyptian numbers only"
                    error={form.formState.errors.phone?.message}
                    registration={form.register("phone")}
                  />
                  <label className="flex items-center gap-2 text-sm text-body">
                    <input
                      type="checkbox"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="h-4 w-4 accent-brand-600"
                    />
                    Save this address to my account
                  </label>
                </div>
              )}
            </CheckoutSection>

            <CheckoutSection
              icon="wallet"
              title="Payment Method"
              subtitle="Choose how you'd like to pay"
            >
              <div className="space-y-4">
                {paymentMethods.map((m) => (
                  <PaymentOption
                    key={m.id}
                    method={m}
                    active={method.id === m.id}
                    onSelect={() => setMethod(m)}
                  />
                ))}
                <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Icon name="shield-check" size={18.8} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-heading">
                      Secure &amp; Encrypted
                    </p>
                    <p className="text-xs text-green-700">
                      Your payment info is protected with 256-bit SSL encryption
                    </p>
                  </div>
                </div>
              </div>
            </CheckoutSection>
          </div>

          <CheckoutSummary
            cart={cart}
            method={method}
            isSubmitting={placeOrder.isPending}
            isBlocked={addresses.isLoading}
            onSubmit={submit}
          />
        </div>
      </div>
    </div>
  );
}
