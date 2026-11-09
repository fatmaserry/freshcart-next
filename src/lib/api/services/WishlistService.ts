import { BaseService } from "./BaseService";
import type { WishlistMutationResponse, WishlistResponse } from "@/types/api";

export class WishlistService extends BaseService {
  protected readonly resource = "wishlist";

  get() {
    return this.http.get<WishlistResponse>(this.path(), { auth: true });
  }

  add(productId: string) {
    return this.http.post<WishlistMutationResponse>(
      this.path(),
      { productId },
      { auth: true },
    );
  }

  remove(productId: string) {
    return this.http.delete<WishlistMutationResponse>(
      this.path(`/${productId}`),
      { auth: true },
    );
  }
}
