import { matchesSearch } from "@/lib/productSearch";
import { parsePage } from "@/lib/utils";
import type { Product } from "@/types/api";

export interface Filters {
  q: string;
  sort: string;
  categories: string[];
  brands: string[];
  min: string;
  max: string;
  page: number;
}

export const EMPTY: Filters = {
  q: "",
  sort: "",
  categories: [],
  brands: [],
  min: "",
  max: "",
  page: 1,
};

export function fromUrl(params: URLSearchParams): Filters {
  return {
    q: params.get("q") ?? "",
    sort: params.get("sort") ?? "",
    categories: params.getAll("category"),
    brands: params.getAll("brand"),
    min: params.get("minPrice") ?? "",
    max: params.get("maxPrice") ?? "",
    page: parsePage(params.get("page")),
  };
}

export function toUrl(f: Filters) {
  const params = new URLSearchParams();
  if (f.q) params.set("q", f.q);
  if (f.sort) params.set("sort", f.sort);
  f.categories.forEach((id) => params.append("category", id));
  f.brands.forEach((id) => params.append("brand", id));
  if (f.min) params.set("minPrice", f.min);
  if (f.max) params.set("maxPrice", f.max);
  if (f.page > 1) params.set("page", String(f.page));
  return params.toString();
}

export function applyFilters(products: Product[], f: Filters) {
  const min = f.min ? Number(f.min) : 0;
  const max = f.max ? Number(f.max) : Infinity;
  const matches = products.filter(
    (p) =>
      (!f.q.trim() || matchesSearch(p, f.q)) &&
      (!f.categories.length || f.categories.includes(p.category?._id)) &&
      (!f.brands.length || f.brands.includes(p.brand?._id)) &&
      p.price >= min &&
      p.price <= max,
  );
  if (!f.sort) return matches;
  const direction = f.sort.startsWith("-") ? -1 : 1;
  const field = f.sort.replace("-", "");
  return [...matches].sort((a, b) => {
    if (field === "title") return direction * a.title.localeCompare(b.title);
    if (field === "price") return direction * (a.price - b.price);
    return direction * (a.ratingsAverage - b.ratingsAverage);
  });
}

export const toggled = (list: string[], id: string) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
