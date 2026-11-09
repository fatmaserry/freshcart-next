import { BaseService } from "./BaseService";
import type { Paginated, Review, ReviewPayload, Single } from "@/types/api";

export class ReviewService extends BaseService {
  protected readonly resource = "reviews";

  getForProduct(
    productId: string,
    params: { page?: number; limit?: number } = {},
  ) {
    return this.http.get<Paginated<Review>>(`/products/${productId}/reviews`, {
      query: { sort: "-createdAt", ...params },
    });
  }

  create(productId: string, payload: ReviewPayload) {
    return this.http.post<Single<Review>>(
      `/products/${productId}/reviews`,
      payload,
      { auth: true },
    );
  }

  update(reviewId: string, payload: ReviewPayload) {
    return this.http.put<Single<Review>>(this.path(`/${reviewId}`), payload, {
      auth: true,
    });
  }

  remove(reviewId: string) {
    return this.http.delete<void>(this.path(`/${reviewId}`), { auth: true });
  }
}
