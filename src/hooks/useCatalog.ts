"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query/keys";
import type { ProductQuery, SubCategory } from "@/types/api";

export const useProducts = (q: ProductQuery, enabled = true) =>
  useQuery({
    queryKey: queryKeys.products.list(q),
    queryFn: () => api.products.getAll(q),
    placeholderData: keepPreviousData,
    enabled,
  });

export const useProduct = (id: string) =>
  useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => api.products.getById(id),
    enabled: !!id,
  });

export const useCategories = () =>
  useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => api.categories.getAll({ limit: 50 }),
    staleTime: 10 * 60_000,
  });

export const useCategory = (id: string) =>
  useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => api.categories.getById(id),
    enabled: !!id,
  });

// The nested endpoint can return another category's children, so results are merged and filtered.
export const useCategorySubcategories = (id: string) =>
  useQuery({
    queryKey: queryKeys.categories.subcategories(id),
    queryFn: async () => {
      const [nested, all] = await Promise.all([
        api.categories.getSubCategories(id),
        api.subcategories.getAll({ limit: 200 }),
      ]);
      const byId = new Map<string, SubCategory>();
      [...nested.data, ...all.data]
        .filter((s) => s.category === id)
        .forEach((s) => byId.set(s._id, s));
      const data = [...byId.values()];
      return { ...nested, results: data.length, data };
    },
    enabled: !!id,
  });

export const useSubCategory = (id: string | null) =>
  useQuery({
    queryKey: queryKeys.subcategories.detail(id ?? ""),
    queryFn: () => api.subcategories.getById(id!),
    enabled: !!id,
  });

export const useBrands = (page = 1, limit = 60) =>
  useQuery({
    queryKey: [...queryKeys.brands.all, page, limit],
    queryFn: () => api.brands.getAll({ page, limit }),
    staleTime: 10 * 60_000,
    placeholderData: keepPreviousData,
  });

export const useBrand = (id: string) =>
  useQuery({
    queryKey: queryKeys.brands.detail(id),
    queryFn: () => api.brands.getById(id),
    enabled: !!id,
  });

// The API has no text search, so the catalog is loaded once and matched on the client.
export const useProductSearchPool = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.products.searchPool,
    queryFn: () => api.products.getAll({ limit: 200 }),
    staleTime: 5 * 60_000,
    enabled,
  });
