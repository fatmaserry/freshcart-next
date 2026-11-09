import { ApiError } from "@/lib/api/HttpClient";

// Thrown errors lose their message across the server-action boundary in production.
export type ActionResult<T> =
  { ok: true; data: T } | { ok: false; error: string; status: number };

export async function runAction<T>(
  fn: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    if (e instanceof ApiError)
      return { ok: false, error: e.message, status: e.status };
    console.error(e);
    return { ok: false, error: "Something went wrong", status: 500 };
  }
}

export async function unwrap<T>(result: Promise<ActionResult<T>>): Promise<T> {
  const r = await result;
  if (r.ok) return r.data;
  throw new ApiError(r.error, r.status);
}
