import type { HttpClient } from "../HttpClient";
import { BaseService } from "./BaseService";
import type { ApiMessage, CartResponse } from "@/types/api";

export class CartService extends BaseService {
  protected readonly resource = "cart";

  constructor(
    http: HttpClient,
    private readonly httpV2: HttpClient,
  ) {
    super(http);
  }

  get() {
    return this.http.get<CartResponse>(this.path(), { auth: true });
  }

  add(productId: string) {
    return this.http.post<CartResponse>(
      this.path(),
      { productId },
      { auth: true },
    );
  }

  // The API adds one unit at a time, so larger quantities need a follow-up update.
  async addQuantity(productId: string, count = 1): Promise<CartResponse> {
    const res = await this.add(productId);
    if (count <= 1) return res;
    const item = res.data.products.find(
      (p) =>
        (typeof p.product === "string" ? p.product : p.product._id) ===
        productId,
    );
    return this.updateCount(productId, (item?.count ?? 1) - 1 + count);
  }

  updateCount(productId: string, count: number) {
    return this.http.put<CartResponse>(
      this.path(`/${productId}`),
      { count },
      { auth: true },
    );
  }

  remove(productId: string) {
    return this.http.delete<CartResponse>(this.path(`/${productId}`), {
      auth: true,
    });
  }

  applyCoupon(couponName: string) {
    return this.httpV2.put<CartResponse>(
      this.path("/applyCoupon"),
      { couponName },
      { auth: true },
    );
  }

  clear() {
    return this.http.delete<ApiMessage>(this.path(), { auth: true });
  }
}
