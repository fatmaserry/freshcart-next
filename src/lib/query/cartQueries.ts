import type { QueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/api/HttpClient";
import { queryKeys } from "./keys";
import type { CartResponse, CartView, Product } from "@/types/api";
import { unwrap } from "@/lib/actions/result";

export const cartKey = (authenticated: boolean) =>
  [...queryKeys.cart, authenticated ? "user" : "guest"] as const;

export const wishlistKey = (authenticated: boolean) =>
  [...queryKeys.wishlist, authenticated ? "user" : "guest"] as const;

// The API answers 404 when the user has no cart yet.
export async function fetchServerCart(): Promise<CartResponse | null> {
  try {
    return await unwrap(api.session.getCart());
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export const getServerCart = (qc: QueryClient) =>
  qc.fetchQuery({
    queryKey: cartKey(true),
    queryFn: fetchServerCart,
    staleTime: 30_000,
  });

export const fetchProduct = (qc: QueryClient, id: string) =>
  qc.fetchQuery<Product>({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => api.products.getById(id),
    staleTime: 5 * 60_000,
  });

// staleTime 0 because stock checks need the live quantity.
export const fetchFreshProduct = (qc: QueryClient, id: string) =>
  qc.fetchQuery<Product>({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => api.products.getById(id),
    staleTime: 0,
  });

export const cartItemProductId = (p: CartView["data"]["products"][number]) =>
  typeof p.product === "string" ? (p.product as string) : p.product._id;
