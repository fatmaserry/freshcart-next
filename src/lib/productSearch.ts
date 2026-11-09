import type { Product } from "@/types/api";

export function matchesSearch(p: Product, term: string) {
  const needle = term.trim().toLowerCase();
  return [p.title, p.brand?.name, p.category?.name].some((text) =>
    text?.toLowerCase().includes(needle),
  );
}
