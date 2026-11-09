import type { ProductQuery } from "@/types/api";

export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (q: ProductQuery) => ["products", "list", q] as const,
    detail: (id: string) => ["products", "detail", id] as const,
    reviews: (id: string) => ["products", "reviews", id] as const,
    searchPool: ["products", "search"] as const,
  },
  categories: {
    all: ["categories"] as const,
    detail: (id: string) => ["categories", id] as const,
    subcategories: (id: string) => ["categories", id, "subcategories"] as const,
  },
  subcategories: {
    detail: (id: string) => ["subcategories", id] as const,
  },
  brands: {
    all: ["brands"] as const,
    detail: (id: string) => ["brands", id] as const,
  },
  cart: ["cart"] as const,
  wishlist: ["wishlist"] as const,
  addresses: ["addresses"] as const,
  allOrders: ["orders"] as const,
  orders: (userId: string) => ["orders", userId] as const,
  locations: ["locations"] as const,
};
