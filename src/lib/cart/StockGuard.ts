import type { QueryClient } from "@tanstack/react-query";
import { fetchFreshProduct } from "@/lib/query/cartQueries";
import type { CartItem, CartView, Product } from "@/types/api";

export class StockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StockError";
  }
}

export interface StockDecision {
  quantity: number;
  notice?: string;
}

export interface StockIssues {
  outOfStock: CartItem[];
  overStock: CartItem[];
  blocksCheckout: boolean;
}

// Callers must pass a freshly fetched product, so `quantity` is the live stock.
export class StockGuard {
  static forAdd(
    product: Product,
    inCart: number,
    requested: number,
  ): StockDecision {
    const stock = product.quantity;
    if (stock <= 0) throw new StockError(`"${product.title}" is out of stock`);
    const remaining = stock - inCart;
    if (remaining <= 0)
      throw new StockError(
        `You already have all ${stock} available in your cart`,
      );
    const quantity = Math.min(requested, remaining);
    return {
      quantity,
      notice:
        quantity < requested
          ? `Only ${stock} in stock — added ${quantity} (you now have ${inCart + quantity})`
          : undefined,
    };
  }

  static forUpdate(product: Product, requested: number): StockDecision {
    const stock = product.quantity;
    if (stock <= 0)
      throw new StockError(
        `"${product.title}" is out of stock — please remove it`,
      );
    const quantity = Math.min(requested, stock);
    return {
      quantity,
      notice: quantity < requested ? `Only ${stock} in stock` : undefined,
    };
  }

  static async assertCheckout(qc: QueryClient, items: CartItem[]) {
    const fresh = await Promise.all(
      items.map((i) => fetchFreshProduct(qc, i.product._id)),
    );
    const index = items.findIndex((i, idx) => i.count > fresh[idx].quantity);
    if (index < 0) return;
    const left = fresh[index].quantity;
    const title = items[index].product.title;
    throw new StockError(
      left <= 0
        ? `"${title}" is now out of stock. Please update your cart.`
        : `Only ${left} of "${title}" left in stock. Please update your cart.`,
    );
  }

  static issues(cart: CartView | null | undefined): StockIssues {
    const items = cart?.data.products ?? [];
    // Some API responses omit stock, and unknown stock must not block checkout.
    const known = items.filter(
      (i) =>
        typeof i.product === "object" && typeof i.product.quantity === "number",
    );
    const outOfStock = known.filter((i) => i.product.quantity <= 0);
    const overStock = known.filter(
      (i) => i.product.quantity > 0 && i.count > i.product.quantity,
    );
    return {
      outOfStock,
      overStock,
      blocksCheckout:
        overStock.length > 0 || outOfStock.length === items.length,
    };
  }

  static available(cart: CartView) {
    return cart.data.products.filter(
      (i) => !StockGuard.isOutOfStock(i.product),
    );
  }

  static payableTotal(cart: CartView) {
    return StockGuard.available(cart).reduce(
      (sum, i) => sum + i.price * i.count,
      0,
    );
  }

  static isOutOfStock(product: Pick<Product, "quantity">) {
    return typeof product.quantity === "number" && product.quantity <= 0;
  }
}
