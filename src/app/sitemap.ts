import type { MetadataRoute } from "next";
import { cacheLife } from "next/cache";
import { api } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

const staticEntries: MetadataRoute.Sitemap = [
  { url: SITE_URL, changeFrequency: "daily", priority: 1 },
  { url: `${SITE_URL}/products`, changeFrequency: "daily", priority: 0.9 },
  { url: `${SITE_URL}/categories`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${SITE_URL}/brands`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
  { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife("days");

  // If the catalog API is down, a smaller sitemap is better than a failed one.
  const [products, categories] = await Promise.all([
    api.products.getAll({ limit: 200 }).catch(() => null),
    api.categories.getAll({ limit: 50 }).catch(() => null),
  ]);

  return [
    ...staticEntries,
    ...(categories?.data ?? []).map((c) => ({
      url: `${SITE_URL}/categories/${c._id}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...(products?.data ?? []).map((p) => ({
      url: `${SITE_URL}/products/${p._id}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
