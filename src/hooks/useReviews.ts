"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";
import type { ReviewPayload } from "@/types/api";
import type { MutationOpts } from "./mutationOptions";
import { unwrap } from "@/lib/actions/result";
import {
  createReviewAction,
  deleteReviewAction,
  updateReviewAction,
} from "@/actions/review.actions";

export const useProductReviews = (productId: string) =>
  useQuery({
    queryKey: queryKeys.products.reviews(productId),
    queryFn: () => api.reviews.getForProduct(productId, { limit: 50 }),
  });

export const useCreateReview = (
  productId: string,
  opts?: MutationOpts<unknown, ReviewPayload>,
) =>
  useMutation({
    mutationFn: (v: ReviewPayload) => unwrap(createReviewAction(productId, v)),
    ...opts,
  });

export const useUpdateReview = (
  opts?: MutationOpts<unknown, { id: string; v: ReviewPayload }>,
) =>
  useMutation({
    mutationFn: ({ id, v }: { id: string; v: ReviewPayload }) =>
      unwrap(updateReviewAction(id, v)),
    ...opts,
  });

export const useDeleteReview = (opts?: MutationOpts<unknown, string>) =>
  useMutation({
    mutationFn: (id: string) => unwrap(deleteReviewAction(id)),
    ...opts,
  });
