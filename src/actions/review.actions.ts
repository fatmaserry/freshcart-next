"use server";

import { serverApi } from "@/lib/api/server";
import { runAction } from "@/lib/actions/result";
import { assertId } from "@/lib/actions/validate";
import type { ReviewPayload } from "@/types/api";

export const createReviewAction = async (
  productId: string,
  payload: ReviewPayload,
) =>
  runAction(() => {
    assertId(productId);
    return serverApi.reviews.create(productId, payload);
  });

export const updateReviewAction = async (id: string, payload: ReviewPayload) =>
  runAction(() => {
    assertId(id);
    return serverApi.reviews.update(id, payload);
  });

export const deleteReviewAction = async (id: string) =>
  runAction(() => {
    assertId(id);
    return serverApi.reviews.remove(id);
  });
