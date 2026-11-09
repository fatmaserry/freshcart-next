"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeCartItemAction } from "@/actions/cart.actions";
import { unwrap } from "@/lib/actions/result";
import { ApiError } from "@/lib/api/HttpClient";
import { StockError, StockGuard } from "@/lib/cart/StockGuard";
import type { PaymentMethod, PaymentResult } from "@/lib/payment";
import { queryKeys } from "@/lib/query/keys";
import type { CartView, ShippingAddress } from "@/types/api";
import type { MutationOpts } from "./mutationOptions";

interface PlaceOrderVars {
  cart: CartView;
  shipping: ShippingAddress;
  method: PaymentMethod;
}

export function usePlaceOrder(
  opts?: MutationOpts<PaymentResult, PlaceOrderVars>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ cart, shipping, method }: PlaceOrderVars) => {
      if (!cart.cartId) throw new ApiError("Please log in to continue", 401);

      // Stock may have changed since the cart loaded.
      try {
        await StockGuard.assertCheckout(qc, StockGuard.available(cart));
      } catch (e) {
        if (e instanceof StockError)
          qc.invalidateQueries({ queryKey: queryKeys.cart });
        throw e;
      }

      // The API orders the whole cart, so unavailable items have to leave it first.
      for (const { product } of StockGuard.issues(cart).outOfStock) {
        await unwrap(removeCartItemAction(product._id));
      }

      return method.pay({ cartId: cart.cartId, shipping });
    },
    ...opts,
  });
}
