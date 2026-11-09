import { BaseService } from "./BaseService";
import type {
  CheckoutSessionResponse,
  Order,
  ShippingAddress,
} from "@/types/api";

export class OrderService extends BaseService {
  protected readonly resource = "orders";

  createCashOrder(cartId: string, shippingAddress: ShippingAddress) {
    return this.http.post<{ status: string; data: Order }>(
      this.path(`/${cartId}`),
      { shippingAddress },
      { auth: true },
    );
  }

  createCheckoutSession(
    cartId: string,
    shippingAddress: ShippingAddress,
    returnUrl: string,
  ) {
    return this.http.post<CheckoutSessionResponse>(
      this.path(`/checkout-session/${cartId}`),
      { shippingAddress },
      { auth: true, query: { url: returnUrl } },
    );
  }

  getUserOrders(userId: string) {
    return this.http.get<Order[]>(this.path(`/user/${userId}`));
  }
}
