import { ApiError } from "@/lib/api/HttpClient";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const num = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
export const formatNumber = (value: number) => num.format(value);
export const formatPrice = (value: number) => `${formatNumber(value)} EGP`;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
) {
  if (error instanceof ApiError || error instanceof Error)
    return error.message || fallback;
  return fallback;
}

// Parsed the way the browser will parse it, because prefix checks miss "//evil.com",
// "/\\evil.com" and "/<tab>/evil.com".
export function safeInternalPath(path: string | null, fallback = "/") {
  if (!path?.startsWith("/")) return fallback;
  const base = "http://internal.invalid";
  try {
    const url = new URL(path, base);
    return url.origin === base
      ? url.pathname + url.search + url.hash
      : fallback;
  } catch {
    return fallback;
  }
}

export function parsePage(value: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}
