import "server-only";
import { headers } from "next/headers";
import { readSessionJwt } from "./sessionJwt";
import type { ITokenProvider } from "./TokenProvider";

export class SessionTokenProvider implements ITokenProvider {
  async getToken(): Promise<string | null> {
    const jwt = await readSessionJwt({ headers: await headers() });
    return jwt?.user?.token ?? null;
  }
}
