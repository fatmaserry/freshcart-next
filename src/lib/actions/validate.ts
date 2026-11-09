import { ApiError } from "@/lib/api/HttpClient";

const OBJECT_ID = /^[a-f\d]{24}$/i;

export function assertId(id: string) {
  if (typeof id !== "string" || !OBJECT_ID.test(id))
    throw new ApiError("Invalid id", 400);
}

export function assertCount(count: number) {
  if (!Number.isInteger(count) || count < 1)
    throw new ApiError("Invalid quantity", 400);
}
