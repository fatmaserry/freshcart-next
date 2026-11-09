"use server";

import { serverApi } from "@/lib/api/server";
import { runAction } from "@/lib/actions/result";
import { ApiError } from "@/lib/api/HttpClient";
import { assertCount, assertId } from "@/lib/actions/validate";

export const addToCartAction = async (productId: string, count: number) =>
  runAction(() => {
    assertId(productId);
    assertCount(count);
    return serverApi.cart.addQuantity(productId, count);
  });

export const updateCartItemAction = async (productId: string, count: number) =>
  runAction(() => {
    assertId(productId);
    assertCount(count);
    return serverApi.cart.updateCount(productId, count);
  });

export const removeCartItemAction = async (productId: string) =>
  runAction(() => {
    assertId(productId);
    return serverApi.cart.remove(productId);
  });

export const clearCartAction = async () =>
  runAction(() => serverApi.cart.clear());

export const applyCouponAction = async (couponName: string) =>
  runAction(() => {
    if (typeof couponName !== "string" || !couponName.trim())
      throw new ApiError("Enter a coupon code", 400);
    return serverApi.cart.applyCoupon(couponName.trim());
  });
