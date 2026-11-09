import type { HttpClient } from "../HttpClient";
import type { ActionResult } from "@/lib/actions/result";
import type { CartResponse, WishlistResponse } from "@/types/api";

export class SessionDataService {
  constructor(private readonly http: HttpClient) {}

  getCart = () => this.http.get<ActionResult<CartResponse>>("/cart");
  getWishlist = () =>
    this.http.get<ActionResult<WishlistResponse>>("/wishlist");
}
