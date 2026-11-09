export const FREE_SHIPPING_THRESHOLD = 500;
export const SHIPPING_FEE = 50;

export const shippingFor = (subtotal: number) =>
  subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
