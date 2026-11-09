import { createCheckoutSessionAction } from "@/actions/order.actions";
import { unwrap } from "@/lib/actions/result";
import type {
  PaymentMethod,
  PaymentRequest,
  PaymentResult,
} from "../PaymentMethod";

export class StripeCard implements PaymentMethod {
  readonly id = "card";
  readonly title = "Pay Online";
  readonly description = "Secure payment with Credit/Debit Card via Stripe";
  readonly orderLabel = "Card (Stripe)";
  readonly icon = "credit-card";
  readonly submitIcon = "shield-check";
  readonly submitLabel = "Proceed to Payment";
  readonly badges = [
    { icon: "cc-visa", className: "text-blue-700" },
    { icon: "cc-mastercard", className: "text-orange-500" },
    { icon: "cc-amex", className: "text-sky-600" },
  ] as const;

  async pay({ cartId, shipping }: PaymentRequest): Promise<PaymentResult> {
    const { session } = await unwrap(
      createCheckoutSessionAction(cartId, shipping),
    );
    return { kind: "redirect", url: session.url };
  }
}
