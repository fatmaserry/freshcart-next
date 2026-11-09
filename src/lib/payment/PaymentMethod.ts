import { type IconRef } from "@/components/ui/icons";
import type { ShippingAddress } from "@/types/api";

export interface PaymentRequest {
  cartId: string;
  shipping: ShippingAddress;
}

export type PaymentResult =
  { kind: "completed"; message: string } | { kind: "redirect"; url: string };

export interface PaymentMethod {
  // Must match the API's `paymentMethodType`.
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly orderLabel: string;
  readonly icon: IconRef;
  readonly submitIcon: IconRef;
  readonly submitLabel: string;
  readonly badges?: readonly { icon: IconRef; className: string }[];

  pay(request: PaymentRequest): Promise<PaymentResult>;
}
