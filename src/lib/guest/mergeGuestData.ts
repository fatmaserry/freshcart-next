import type { QueryClient } from "@tanstack/react-query";
import { addToCartAction } from "@/actions/cart.actions";
import { addToWishlistAction } from "@/actions/wishlist.actions";
import { unwrap } from "@/lib/actions/result";
import { ApiError } from "@/lib/api/HttpClient";
import { StockError, StockGuard } from "@/lib/cart/StockGuard";
import {
  cartItemProductId,
  fetchFreshProduct,
  getServerCart,
} from "@/lib/query/cartQueries";
import { guestCart, guestWishlist } from "./GuestStore";

export interface MergeResult {
  merged: boolean;
  notices: string[];
}

export async function mergeGuestData(qc: QueryClient): Promise<MergeResult> {
  const cartItems = guestCart.items();
  const wishItems = guestWishlist.items();
  const notices: string[] = [];
  let moved = 0;
  if (!cartItems.length && !wishItems.length) return { merged: false, notices };

  const serverCart = await getServerCart(qc).catch(() => null);
  const inServerCart = (id: string) =>
    serverCart?.data.products.find((p) => cartItemProductId(p) === id)?.count ??
    0;

  for (const item of cartItems) {
    try {
      const inCart = inServerCart(item.product._id);
      // The higher quantity wins, so a retried merge can't double what is already in the account.
      if (item.count > inCart) {
        const product = await fetchFreshProduct(qc, item.product._id);
        const decision = StockGuard.forAdd(
          product,
          inCart,
          item.count - inCart,
        );
        await unwrap(addToCartAction(product._id, decision.quantity));
        if (decision.notice)
          notices.push(`${product.title}: ${decision.notice}`);
      }
      guestCart.remove(item.product._id);
      moved++;
    } catch (e) {
      if (
        e instanceof StockError ||
        (e instanceof ApiError && e.status === 404)
      ) {
        // Sold out or deleted, so retrying at every future login can't help.
        guestCart.remove(item.product._id);
        notices.push(`${item.product.title}: ${e.message}`);
      } else {
        // Probably temporary: it stays in the guest cart and is retried at the next login.
        notices.push(`${item.product.title} couldn't be added`);
      }
    }
  }

  for (const product of wishItems) {
    try {
      await unwrap(addToWishlistAction(product._id));
      guestWishlist.remove(product._id);
      moved++;
    } catch {
      // Stays in the guest wishlist and is retried at the next login.
    }
  }

  return { merged: moved > 0, notices };
}
