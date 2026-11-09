import { createCashOrderAction } from "@/actions/order.actions";
import { unwrap } from "@/lib/actions/result";
import type {
  PaymentMethod,
  PaymentRequest,
  PaymentResult,
} from "../PaymentMethod";

export class CashOnDelivery implements PaymentMethod {
  readonly id = "cash";
  readonly title = "Cash on Delivery";
  readonly description = "Pay when your order arrives at your doorstep";
  readonly orderLabel = "Cash on delivery";
  readonly icon = "banknote";
  readonly submitIcon = "lock";
  readonly submitLabel = "Place Order";

  async pay({ cartId, shipping }: PaymentRequest): Promise<PaymentResult> {
    await unwrap(createCashOrderAction(cartId, shipping));
    return {
      kind: "completed",
      message: "Order placed! Pay cash when it arrives.",
    };
  }
}
