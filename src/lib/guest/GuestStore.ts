import { safeStorage } from "@/lib/safeStorage";
import type { CartView, Product, WishlistView } from "@/types/api";

abstract class LocalList<T> {
  protected abstract readonly key: string;

  protected read(): T[] {
    try {
      const value: unknown = JSON.parse(safeStorage.get(this.key) ?? "[]");
      return Array.isArray(value) ? (value as T[]) : [];
    } catch {
      return [];
    }
  }

  protected write(value: T[]) {
    safeStorage.set(this.key, JSON.stringify(value));
  }

  clear() {
    safeStorage.remove(this.key);
  }

  onExternalChange(listener: () => void) {
    const onStorage = (event: StorageEvent) => {
      if (event.key === this.key || event.key === null) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }
}

export interface GuestCartItem {
  product: Product;
  count: number;
}

export class GuestCartStore extends LocalList<GuestCartItem> {
  protected readonly key = "freshcart:guest-cart";
  items(): GuestCartItem[] {
    return this.read();
  }

  get(): CartView | null {
    const items = this.read();
    if (!items.length) return null;
    const products = items.map((i) => ({
      _id: i.product._id,
      count: i.count,
      price: i.product.price,
      product: i.product,
    }));
    return {
      numOfCartItems: items.length,
      data: {
        products,
        totalCartPrice: products.reduce((sum, p) => sum + p.price * p.count, 0),
      },
    };
  }

  add(product: Product, count = 1): CartView | null {
    const items = this.read();
    const existing = items.find((i) => i.product._id === product._id);
    // StockGuard has already capped the quantity; the product is refreshed to keep prices current.
    if (existing) {
      existing.count += count;
      existing.product = product;
    } else items.push({ product, count });
    this.write(items);
    return this.get();
  }

  update(productId: string, count: number, product?: Product): CartView | null {
    this.write(
      this.read().map((i) =>
        i.product._id === productId
          ? { product: product ?? i.product, count }
          : i,
      ),
    );
    return this.get();
  }

  refreshProducts(fresh: Product[]) {
    const byId = new Map(fresh.map((p) => [p._id, p]));
    this.write(
      this.read().map((i) => ({
        ...i,
        product: byId.get(i.product._id) ?? i.product,
      })),
    );
  }

  remove(productId: string): CartView | null {
    this.write(this.read().filter((i) => i.product._id !== productId));
    return this.get();
  }
}

export class GuestWishlistStore extends LocalList<Product> {
  protected readonly key = "freshcart:guest-wishlist";
  items(): Product[] {
    return this.read();
  }

  get(): WishlistView {
    const data = this.read();
    return { count: data.length, data };
  }

  add(product: Product): WishlistView {
    const data = this.read();
    if (!data.some((p) => p._id === product._id))
      this.write([...data, product]);
    return this.get();
  }

  remove(productId: string): WishlistView {
    this.write(this.read().filter((p) => p._id !== productId));
    return this.get();
  }
}

export const guestCart = new GuestCartStore();
export const guestWishlist = new GuestWishlistStore();
