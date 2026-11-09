"use server";

import { serverApi } from "@/lib/api/server";
import { runAction } from "@/lib/actions/result";
import { assertId } from "@/lib/actions/validate";

export const addToWishlistAction = async (productId: string) =>
  runAction(() => {
    assertId(productId);
    return serverApi.wishlist.add(productId);
  });

export const removeFromWishlistAction = async (productId: string) =>
  runAction(() => {
    assertId(productId);
    return serverApi.wishlist.remove(productId);
  });
