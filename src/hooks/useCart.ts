"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  addToCartAction,
  applyCouponAction,
  clearCartAction,
  removeCartItemAction,
  updateCartItemAction,
} from "@/actions/cart.actions";
import { unwrap } from "@/lib/actions/result";
import { StockGuard } from "@/lib/cart/StockGuard";
import { guestCart } from "@/lib/guest/GuestStore";
import {
  cartItemProductId,
  cartKey,
  fetchFreshProduct,
  fetchServerCart,
  getServerCart,
} from "@/lib/query/cartQueries";
import { getErrorMessage } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import type { CartView } from "@/types/api";

// One at a time, so requests reach the API in the order the customer made them.
const CART_SCOPE = { id: "cart" };

// Some mutations return un-populated products, which the cart UI can't render.
const isPopulated = (cart: CartView) =>
  cart.data.products.every((p) => typeof p.product === "object");

export function useCart() {
  const qc = useQueryClient();
  const { isAuthenticated, isReady } = useAuth();
  return useQuery({
    queryKey: cartKey(isAuthenticated),
    enabled: isReady,
    // Another device may have changed the cart; guests are covered by storage events.
    refetchOnWindowFocus: isAuthenticated && "always",
    queryFn: async (): Promise<CartView | null> => {
      if (isAuthenticated) return fetchServerCart();
      // Saved snapshots go stale, and stock and prices must be current.
      const items = guestCart.items();
      if (items.length) {
        const fresh = await Promise.all(
          items.map((i) =>
            fetchFreshProduct(qc, i.product._id).catch(() => i.product),
          ),
        );
        guestCart.refreshProducts(fresh);
      }
      return guestCart.get();
    },
  });
}

// Cart update and remove responses omit each product's stock, so it is carried over from the cache.
function withKnownStock(cart: CartView, previous: CartView | null | undefined) {
  let missing = false;
  const products = cart.data.products.map((item) => {
    if (typeof item.product.quantity === "number") return item;
    const known = previous?.data.products.find(
      (p) => p.product?._id === item.product._id,
    )?.product;
    if (typeof known?.quantity !== "number") missing = true;
    return known
      ? {
          ...item,
          product: { ...known, ...item.product, quantity: known.quantity },
        }
      : item;
  });
  return { cart: { ...cart, data: { ...cart.data, products } }, missing };
}

function useSyncCart() {
  const qc = useQueryClient();
  const { isAuthenticated } = useAuth();
  return (res: CartView | null) => {
    const key = cartKey(isAuthenticated);
    if (!res) return void qc.setQueryData(key, null);
    if (!isPopulated(res)) return void qc.invalidateQueries({ queryKey: key });
    const { cart, missing } = withKnownStock(
      res,
      qc.getQueryData<CartView | null>(key),
    );
    qc.setQueryData(key, cart);
    if (missing) qc.invalidateQueries({ queryKey: key });
  };
}

export function useAddToCart() {
  const qc = useQueryClient();
  const { isAuthenticated } = useAuth();
  const sync = useSyncCart();
  const mutation = useMutation({
    scope: CART_SCOPE,
    mutationFn: async ({
      productId,
      count = 1,
    }: {
      productId: string;
      count?: number;
    }) => {
      const product = await fetchFreshProduct(qc, productId);
      const cart = isAuthenticated ? await getServerCart(qc) : guestCart.get();
      const inCart =
        cart?.data.products.find((p) => cartItemProductId(p) === productId)
          ?.count ?? 0;
      const decision = StockGuard.forAdd(product, inCart, count);
      const res = isAuthenticated
        ? await unwrap(addToCartAction(productId, decision.quantity))
        : guestCart.add(product, decision.quantity);
      return { res, decision };
    },
    onSuccess: ({ res, decision }) => {
      sync(res);
      if (decision.notice) toast.warning(decision.notice);
      else
        toast.success(
          decision.quantity > 1
            ? `${decision.quantity} items added to cart`
            : "Product added to cart",
        );
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
  return {
    ...mutation,
    addToCart: (productId: string, count = 1) =>
      mutation.mutate({ productId, count }),
  };
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  const { isAuthenticated } = useAuth();
  const sync = useSyncCart();
  const key = cartKey(isAuthenticated);
  return useMutation({
    scope: CART_SCOPE,
    mutationFn: async ({
      productId,
      count,
    }: {
      productId: string;
      count: number;
    }) => {
      const product = await fetchFreshProduct(qc, productId);
      const decision = StockGuard.forUpdate(product, count);
      const res = isAuthenticated
        ? await unwrap(updateCartItemAction(productId, decision.quantity))
        : guestCart.update(productId, decision.quantity, product);
      return { res, decision };
    },
    // Optimistic so the counter feels instant.
    onMutate: async ({ productId, count }) => {
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<CartView | null>(key);
      if (previous) {
        const products = previous.data.products.map((p) =>
          p.product._id === productId
            ? {
                ...p,
                count:
                  typeof p.product.quantity === "number"
                    ? Math.min(count, Math.max(p.product.quantity, 1))
                    : count,
              }
            : p,
        );
        const totalCartPrice = products.reduce(
          (sum, p) => sum + p.price * p.count,
          0,
        );
        qc.setQueryData<CartView>(key, {
          ...previous,
          data: { ...previous.data, products, totalCartPrice },
        });
      }
      return { previous };
    },
    onError: (e, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(key, ctx.previous);
      toast.error(getErrorMessage(e));
    },
    onSuccess: ({ res, decision }) => {
      sync(res);
      if (decision.notice) toast.warning(decision.notice);
    },
  });
}

export function useRemoveCartItem() {
  const { isAuthenticated } = useAuth();
  const sync = useSyncCart();
  return useMutation({
    scope: CART_SCOPE,
    mutationFn: async (productId: string) =>
      isAuthenticated
        ? unwrap(removeCartItemAction(productId))
        : guestCart.remove(productId),
    onSuccess: (res) => {
      sync(res && res.data.products.length ? res : null);
      toast.success("Item removed from cart");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function useClearCart() {
  const { isAuthenticated } = useAuth();
  const sync = useSyncCart();
  return useMutation({
    scope: CART_SCOPE,
    mutationFn: async () => {
      if (isAuthenticated) await unwrap(clearCartAction());
      else guestCart.clear();
    },
    onSuccess: () => {
      sync(null);
      toast.success("Cart cleared");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function useApplyCoupon() {
  const sync = useSyncCart();
  return useMutation({
    scope: CART_SCOPE,
    mutationFn: (couponName: string) => unwrap(applyCouponAction(couponName)),
    onSuccess: (res) => {
      sync(res);
      toast.success("Coupon applied");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}
