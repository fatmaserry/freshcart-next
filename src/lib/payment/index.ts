import type { PaymentMethod } from "./PaymentMethod";
import { CashOnDelivery } from "./methods/CashOnDelivery";
import { StripeCard } from "./methods/StripeCard";

export type {
  PaymentMethod,
  PaymentRequest,
  PaymentResult,
} from "./PaymentMethod";

export const paymentMethods: readonly PaymentMethod[] = [
  new CashOnDelivery(),
  new StripeCard(),
];

export const defaultPaymentMethod = paymentMethods[0];

export const findPaymentMethod = (id: string) =>
  paymentMethods.find((m) => m.id === id);
