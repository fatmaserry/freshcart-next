"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  addToWishlistAction,
  removeFromWishlistAction,
} from "@/actions/wishlist.actions";
import { unwrap } from "@/lib/actions/result";
import { api } from "@/lib/api";
import { guestWishlist } from "@/lib/guest/GuestStore";
import { fetchProduct, wishlistKey } from "@/lib/query/cartQueries";
import { getErrorMessage } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import type { WishlistView } from "@/types/api";

export function useWishlist() {
  const { isAuthenticated, isReady } = useAuth();
  const query = useQuery({
    queryKey: wishlistKey(isAuthenticated),
    enabled: isReady,
    // Another device may have changed the wishlist; guests are covered by storage events.
    refetchOnWindowFocus: isAuthenticated && "always",
    queryFn: async (): Promise<WishlistView> =>
      isAuthenticated ? unwrap(api.session.getWishlist()) : guestWishlist.get(),
  });
  const ids = useMemo(
    () => new Set(query.data?.data.map((p) => p._id) ?? []),
    [query.data],
  );
  return { ...query, ids };
}

export function useToggleWishlist() {
  const qc = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { ids } = useWishlist();
  const key = wishlistKey(isAuthenticated);

  const mutation = useMutation({
    mutationFn: async ({
      productId,
      inWishlist,
    }: {
      productId: string;
      inWishlist: boolean;
    }) => {
      if (isAuthenticated) {
        await unwrap(
          inWishlist
            ? removeFromWishlistAction(productId)
            : addToWishlistAction(productId),
        );
      } else if (inWishlist) {
        guestWishlist.remove(productId);
      } else {
        guestWishlist.add(await fetchProduct(qc, productId));
      }
    },
    onMutate: async ({ productId, inWishlist }) => {
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<WishlistView>(key);
      if (previous && inWishlist) {
        const data = previous.data.filter((p) => p._id !== productId);
        qc.setQueryData<WishlistView>(key, {
          ...previous,
          data,
          count: data.length,
        });
      }
      return { previous };
    },
    onSuccess: (_res, { inWishlist }) => {
      toast.success(
        inWishlist ? "Removed from wishlist" : "Product added to wishlist",
      );
    },
    onError: (e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(key, ctx.previous);
      toast.error(getErrorMessage(e));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });

  return {
    ...mutation,
    isInWishlist: (id: string) => ids.has(id),
    toggle: (productId: string) =>
      mutation.mutate({ productId, inWishlist: ids.has(productId) }),
  };
}
