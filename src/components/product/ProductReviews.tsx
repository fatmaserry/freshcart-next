"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Icon } from "@/components/ui/icons";
import { toast } from "react-toastify";
import { queryKeys } from "@/lib/query/keys";
import { formatDate, getErrorMessage } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { Rating, RatingInput, Stars } from "@/components/ui/Rating";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Review, ReviewPayload } from "@/types/api";
import {
  useCreateReview,
  useDeleteReview,
  useProductReviews,
  useUpdateReview,
} from "@/hooks/useReviews";

function ReviewForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: {
  initial?: ReviewPayload;
  onSubmit: (v: ReviewPayload) => void;
  onCancel?: () => void;
  loading: boolean;
}) {
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [review, setReview] = useState(initial?.review ?? "");
  const [error, setError] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!rating) return setError("Pick a rating");
        if (review.trim().length < 3)
          return setError("Write a few words about the product");
        setError("");
        onSubmit({ rating, review: review.trim() });
      }}
      className="space-y-3 rounded-2xl border border-line-soft bg-surface-alt p-5"
    >
      <RatingInput value={rating} onChange={setRating} />
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        rows={3}
        placeholder="What did you like or dislike?"
        className="w-full rounded-xl border border-line-strong bg-surface-card p-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
      />
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={loading}>
          {initial ? "Update review" : "Submit review"}
        </Button>
        {onCancel && (
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

// The API exposes only an average unless written reviews exist, so that case is estimated.
function starShare(star: number, reviews: Review[], average: number) {
  if (reviews.length) {
    const matching = reviews.filter(
      (r) => Math.round(r.rating) === star,
    ).length;
    return Math.round((matching / reviews.length) * 100);
  }
  const distance = Math.abs(star - Math.round(average));
  return distance === 0 ? 60 : distance === 1 ? 25 : 5;
}

export function ProductReviews({
  productId,
  average,
  count,
}: {
  productId: string;
  average: number;
  count: number;
}) {
  const qc = useQueryClient();
  const { isAuthenticated, userId } = useAuth();
  const [editing, setEditing] = useState<string | null>(null);
  const [writing, setWriting] = useState(false);
  const key = queryKeys.products.reviews(productId);

  const reviews = useProductReviews(productId);
  const refresh = () => {
    qc.invalidateQueries({ queryKey: key });
    qc.invalidateQueries({ queryKey: queryKeys.products.detail(productId) });
  };

  const create = useCreateReview(productId, {
    onSuccess: () => {
      toast.success("Thanks for your review!");
      setWriting(false);
      refresh();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
  const update = useUpdateReview({
    onSuccess: () => {
      toast.success("Review updated");
      setEditing(null);
      refresh();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
  const remove = useDeleteReview({
    onSuccess: () => {
      toast.success("Review deleted");
      refresh();
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const list = reviews.data?.data ?? [];
  const mine = list.find((r) => r.user?._id === userId);

  const writeLink = "font-medium text-brand-600 hover:text-brand-700";
  const writeButton = mine ? null : !isAuthenticated ? (
    <Link href={`/login?redirect=/products/${productId}`} className={writeLink}>
      Write a Review
    </Link>
  ) : (
    <button onClick={() => setWriting(true)} className={writeLink}>
      Write a Review
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
        <div className="text-center">
          <div className="mb-2 text-5xl font-bold text-heading">{average}</div>
          <Stars value={average} />
          <p className="mt-2 text-sm text-muted">Based on {count} reviews</p>
        </div>
        <div className="w-full flex-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const share = starShare(star, list, average);
            return (
              <div key={star} className="mb-2 flex items-center gap-3">
                <span className="w-8 whitespace-nowrap text-sm text-body">
                  {star} star
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-line-strong">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all duration-300"
                    style={{ width: `${share}%` }}
                  />
                </div>
                <span className="w-10 text-sm text-muted">{share}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 border-t border-line-soft pt-6">
        {writing && !mine && (
          <ReviewForm
            onSubmit={(v) => create.mutate(v)}
            onCancel={() => setWriting(false)}
            loading={create.isPending}
          />
        )}
        {reviews.isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="py-8 text-center">
            <Icon
              name="star"
              filled
              size={42}
              className="mb-3 text-line-strong"
            />
            <p className="text-muted">
              Customer reviews will be displayed here.
            </p>
            {!writing && <div className="mt-4">{writeButton}</div>}
          </div>
        ) : (
          <ul className="max-h-130 space-y-3 overflow-y-auto pr-1">
            {list.map((r: Review) =>
              editing === r._id ? (
                <li key={r._id}>
                  <ReviewForm
                    initial={r}
                    loading={update.isPending}
                    onCancel={() => setEditing(null)}
                    onSubmit={(v) => update.mutate({ id: r._id, v })}
                  />
                </li>
              ) : (
                <li
                  key={r._id}
                  className="rounded-2xl border border-line-soft/80 bg-surface-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-sm font-bold text-body">
                        {r.user?.name?.[0]?.toUpperCase() ?? "?"}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">
                          {r.user?.name ?? "Customer"}
                        </p>
                        <p className="text-xs text-hint">
                          {formatDate(r.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Rating value={r.rating} />
                  </div>
                  <p className="mt-3 text-sm text-body" dir="auto">
                    {r.review}
                  </p>
                  {r.user?._id === userId && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => setEditing(r._id)}
                        className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-heading"
                      >
                        <Icon name="pencil" size={13} /> Edit
                      </button>
                      <button
                        onClick={() => remove.mutate(r._id)}
                        disabled={remove.isPending}
                        className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700"
                      >
                        <Icon name="trash" size={13} /> Delete
                      </button>
                    </div>
                  )}
                </li>
              ),
            )}
          </ul>
        )}
        {list.length > 0 && !writing && (
          <div className="text-center">{writeButton}</div>
        )}
      </div>
    </div>
  );
}
