"use server";

import { headers } from "next/headers";
import { serverApi } from "@/lib/api/server";
import { runAction } from "@/lib/actions/result";
import { assertId } from "@/lib/actions/validate";
import type { ShippingAddress } from "@/types/api";

export const createCashOrderAction = async (
  cartId: string,
  shipping: ShippingAddress,
) =>
  runAction(() => {
    assertId(cartId);
    return serverApi.orders.createCashOrder(cartId, shipping);
  });

// Taken from the request so a client can't choose where Stripe sends the customer back.
export const createCheckoutSessionAction = async (
  cartId: string,
  shipping: ShippingAddress,
) =>
  runAction(async () => {
    assertId(cartId);
    const h = await headers();
    const origin =
      h.get("origin") ??
      `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
    return serverApi.orders.createCheckoutSession(cartId, shipping, origin);
  });
